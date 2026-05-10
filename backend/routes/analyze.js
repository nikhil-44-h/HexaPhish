const express = require('express');
const router = express.Router();

// Constants for heuristics
const SUSPICIOUS_TLDS = ['.xyz', '.tk', '.ru', '.ml', '.ga', '.cf', '.gq', '.top', '.pw', '.biz', '.info', '.click', '.date', '.loan', '.men', '.online', '.site', '.win'];
const SHORTENER_DOMAINS = ['bit.ly', 't.co', 'tinyurl.com', 'is.gd', 'buff.ly', 'ow.ly', 'rebrand.ly', 'goo.gl', 't.ly', 'bit.do'];
const KNOWN_BRANDS = ['paypal', 'microsoft', 'apple', 'amazon', 'google', 'facebook', 'instagram', 'twitter', 'netflix', 'spotify', 'bankofamerica', 'chase', 'wellsfargo', 'hsbc', 'binance', 'coinbase'];
const SUSPICIOUS_KEYWORDS = ['login', 'secure', 'account', 'verify', 'update', 'auth', 'confirm', 'wallet', 'signin', 'password', 'billing', 'support', 'recovery', 'validate'];
const REDIRECT_PARAMS = ['url', 'redirect', 'next', 'dest', 'destination', 'continue', 'return'];
const TRUSTED_PLATFORMS = [
    'youtube.com', 'instagram.com', 'tiktok.com', 'x.com', 'twitter.com', 
    'telegram.org', 't.me', 'discord.com', 'reddit.com', 'github.com', 
    'linkedin.com', 'facebook.com', 'google.com', 'microsoft.com', 'apple.com',
    'netflix.com', 'spotify.com', 'amazon.com', 'paypal.com'
];

// Helper to calculate Shannon entropy of a string
function getEntropy(str) {
    if (!str) return 0;
    const frequencies = {};
    for (const char of str) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }
    let entropy = 0;
    for (const char in frequencies) {
        const p = frequencies[char] / str.length;
        entropy -= p * Math.log2(p);
    }
    return entropy;
}

router.post('/', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    let riskScore = 0;
    const threats = [];
    
    // Normalize URL
    const lowerUrl = url.toLowerCase();
    
    // --- 1. Protocol Checks ---
    if (url.startsWith('http://')) {
        riskScore += 25;
        threats.push({
            type: 'Unsecured Connection',
            severity: 'high',
            description: 'This site uses unencrypted HTTP instead of HTTPS.',
            whyItMatters: 'Anything you type (passwords, credit cards) can be stolen by anyone on the same network.'
        });
    } else if (!url.startsWith('https://')) {
        riskScore += 15;
        threats.push({
            type: 'Missing Security Protocol',
            severity: 'medium',
            description: 'The URL does not explicitly use a secure HTTPS connection.',
            whyItMatters: 'Secure protocols ensure your data is encrypted and the website is who they say they are.'
        });
    }

    // --- 2. Structural Checks ---
    if (url.length > 100) {
        riskScore += 10;
        threats.push({
            type: 'Excessive Length',
            severity: 'low',
            description: 'The URL is unusually long.',
            whyItMatters: 'Very long links are often used to hide suspicious parts of the address from view.'
        });
    }

    const repeatedChars = /(.)\1{3,}/; // 4+ repeated chars
    if (repeatedChars.test(url)) {
        riskScore += 15;
        threats.push({
            type: 'Suspicious Formatting',
            severity: 'medium',
            description: 'The URL contains repeated special characters (e.g., "---" or "...")',
            whyItMatters: 'Unusual character patterns are often used to bypass security filters or mimic legitimate sites.'
        });
    }

    // --- 3. Domain Analysis ---
    let domain = '';
    let hostname = '';
    try {
        const parseUrl = url.startsWith('http') ? url : `https://${url}`;
        const parsedUrl = new URL(parseUrl);
        hostname = parsedUrl.hostname;
        domain = hostname.split('.').slice(-2).join('.');

        // Platform Awareness
        const isTrustedPlatform = TRUSTED_PLATFORMS.some(d => hostname.endsWith(d));

        // --- Deceptive @ Symbol Check ---
        const hasUserInfo = parsedUrl.username || parsedUrl.password;
        
        // Telegram often uses #@ or /@ for channels
        const isTelegramRouting = hostname.includes('telegram.org') || hostname.includes('t.me');
        const hasLegitSocialAt = (isTrustedPlatform && url.includes('/@')) || (isTelegramRouting && url.includes('#@'));

        if (hasUserInfo) {
            riskScore += 50;
            threats.push({
                type: 'Credential Obfuscation (@)',
                severity: 'critical',
                description: 'The URL uses the @ symbol to hide the real destination domain.',
                whyItMatters: 'Attackers use this to make a link look like "paypal.com@scam-site.com". Your browser will ignore everything before the @ and go directly to the scam site.'
            });
        } else if (url.includes('@') && !hasLegitSocialAt) {
            riskScore += 20;
            threats.push({
                type: 'Suspicious Character (@)',
                severity: 'high',
                description: 'Found an @ symbol in a potentially deceptive context.',
                whyItMatters: 'Unless you are visiting a social media profile, the @ symbol is rarely used and often indicates an attempt to confuse security scanners.'
            });
        }
        
        // Query param check
        const params = parsedUrl.searchParams;
        REDIRECT_PARAMS.forEach(p => {
            if (params.has(p)) {
                // Reduced penalty for trusted platforms
                const penalty = isTrustedPlatform ? 3 : 10;
                riskScore += penalty;
                
                if (penalty > 5) {
                    threats.push({
                        type: 'Redirection Parameter',
                        severity: 'medium',
                        description: `Found a potential redirect parameter: "${p}"`,
                        whyItMatters: 'Phishers often use "open redirects" to send you from a legitimate site to a fake one.'
                    });
                }
            }
        });

    } catch (e) {
        riskScore += 50;
        threats.push({
            type: 'Malformed URL',
            severity: 'high',
            description: 'The URL structure is invalid or corrupt.',
            whyItMatters: 'Legitimate websites always use standard, valid URL structures.'
        });
    }

    if (hostname) {
        // Homograph / Punycode check
        if (hostname.includes('xn--')) {
            riskScore += 45;
            threats.push({
                type: 'Visual Spoofing (Homograph)',
                severity: 'critical',
                description: 'The domain uses special characters that look like normal letters.',
                whyItMatters: 'This is a technique where "googIe.com" (with a capital I) or Unicode characters are used to look identical to the real site.'
            });
        }

        // TLD Check
        const tldMatch = SUSPICIOUS_TLDS.find(tld => hostname.endsWith(tld));
        if (tldMatch) {
            riskScore += 20;
            threats.push({
                type: 'High-Risk Domain Extension',
                severity: 'high',
                description: `The site uses a "${tldMatch}" extension, which is frequently used for scams.`,
                whyItMatters: 'Cheap or free domain extensions are preferred by attackers because they can be registered anonymously and in bulk.'
            });
        }

        // Shortener Check
        if (SHORTENER_DOMAINS.some(d => hostname.includes(d))) {
            riskScore += 20;
            threats.push({
                type: 'URL Shortener Detected',
                severity: 'medium',
                description: 'The link uses a shortening service to hide its final destination.',
                whyItMatters: 'While common, phishers use shorteners to prevent you from seeing where the link actually goes before you click.'
            });
        }

        // Subdomain Check
        const dots = (hostname.match(/\./g) || []).length;
        const trustedProviders = ['github.io', 'vercel.app', 'netlify.app', 'pages.dev', 'azurewebsites.net', 'amazonaws.com'];
        const isTrustedProvider = trustedProviders.some(p => hostname.endsWith(p));

        if (dots > 3 && !isTrustedProvider) {
            riskScore += 25;
            threats.push({
                type: 'Excessive Subdomains',
                severity: 'high',
                description: 'The URL has an unusually high number of sub-sections.',
                whyItMatters: 'Attackers create long subdomains like "paypal.secure-login.com.verify.xyz" to push the real domain off the screen.'
            });
        }

        // Randomness/Entropy Check
        const mainPart = hostname.split('.')[0];
        if (mainPart.length > 10 && getEntropy(mainPart) > 3.8) {
            riskScore += 20;
            threats.push({
                type: 'Randomized Domain',
                severity: 'medium',
                description: 'The domain name appears to be randomly generated.',
                whyItMatters: 'Legitimate brands use readable names. Random strings are often used by automated systems to create thousands of temporary scam sites.'
            });
        }

        // Brand Impersonation
        KNOWN_BRANDS.forEach(brand => {
            if (hostname.includes(brand) && !hostname.endsWith(`${brand}.com`) && !hostname.endsWith(`${brand}.net`) && !hostname.endsWith(`${brand}.org`)) {
                riskScore += 35;
                threats.push({
                    type: 'Brand Impersonation',
                    severity: 'critical',
                    description: `The URL mentions "${brand}" but doesn't seem to be the official site.`,
                    whyItMatters: 'This is the most common phishing tactic—tricking you into thinking you are on a trusted site by putting the brand name somewhere in the address.'
                });
            }
        });
    }

    // --- 4. Content/Keyword Analysis ---
    let foundKeywords = [];
    const isTrustedPlatform = hostname && TRUSTED_PLATFORMS.some(d => hostname.endsWith(d));
    
    SUSPICIOUS_KEYWORDS.forEach(kw => {
        if (lowerUrl.includes(kw)) {
            // Drastically reduced penalty for trusted platforms
            const penalty = isTrustedPlatform ? 2 : 8;
            foundKeywords.push(kw);
            riskScore += penalty;
        }
    });

    if (foundKeywords.length > 0) {
        threats.push({
            type: 'Urgency/Action Keywords',
            severity: 'medium',
            description: `The URL uses sensitive terms: ${foundKeywords.slice(0, 3).join(', ')}...`,
            whyItMatters: 'Scammers use words like "verify" or "wallet" to create a sense of urgency or importance.'
        });
    }

    // IP Check
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(hostname)) {
        riskScore += 45;
        threats.push({
            type: 'Raw IP Address',
            severity: 'critical',
            description: 'The URL uses a numerical address instead of a domain name.',
            whyItMatters: 'Legitimate websites always use names (like google.com). Raw numbers are a massive red flag used to hide identity.'
        });
    }

    // Final Scoring Logic
    riskScore = Math.min(riskScore, 100);
    
    // Confidence Score Calculation (based on number and severity of threats)
    let confidence = 40 + (threats.length * 10);
    if (threats.some(t => t.severity === 'critical')) confidence += 20;
    confidence = Math.min(confidence, 99);

    let status = 'Safe';
    if (riskScore >= 75) {
        status = 'Dangerous';
    } else if (riskScore >= 35) {
        status = 'Suspicious';
    }

    if (threats.length === 0) {
        status = 'Safe';
        riskScore = 0;
        confidence = 98;
        threats.push({
            type: 'No Threats Detected',
            severity: 'low',
            description: 'The URL passed all heuristic security checks.',
            whyItMatters: 'We analyzed the structure, domain, and behavior of this link and found no common phishing patterns.'
        });
    }

    res.json({
        url,
        riskScore,
        confidence,
        status,
        threats,
        timestamp: new Date().toISOString()
    });
});

module.exports = router;


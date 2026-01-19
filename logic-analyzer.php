<?php
/*
Plugin Name: Logic Analyzer
Description: logical analysis
Version: 1.0
Author: Your Name
Author URI: https://yourwebsite.com/
*/

if (!defined('ABSPATH')) {
    exit;
}

function logic_analyzer_embed_responsive_shortcode()
{
    // Configuration
    $app_url = 'https://logical-analyzer.vercel.app'; // Updated URL based on deployment
    $iframe_id = 'logic-analyzer-iframe-' . uniqid();

    ob_start();
    ?>
    <div style="width: 100%; max-width: 1000px; margin: 20px auto;">
        <iframe
            id="<?php echo esc_attr($iframe_id); ?>"
            src="<?php echo esc_url($app_url); ?>/"
            style="width: 100%; border: none; height: 600px; display: block; overflow: hidden; transition: height 0.3s ease-in-out;"
            scrolling="no"
            title="Italian Logical Analysis Tool"
            allow="microphone">
        </iframe>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const iframe = document.getElementById('<?php echo esc_js($iframe_id); ?>');
            const appUrl = '<?php echo esc_js($app_url); ?>';
            let currentHeight = 600;

            function debounce(func, wait) {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                }
            }

            const sendHeight = debounce(function() {
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({
                        type: 'send-height'
                    }, appUrl);
                }
            }, 1500);

            window.addEventListener('scroll', sendHeight, { passive: true });

            window.addEventListener("message", function(event) {
                console.log('event', event);
                // Check against appUrl (origin matches)
                if (event.origin !== appUrl.replace(/\/$/, "")) {
                    return;
                }
                
                const newHeight = event.data?.height;
                console.log('newHeight', newHeight, currentHeight, Math.abs(newHeight - currentHeight) > 10);
                if (typeof newHeight === "number" && Math.abs(newHeight - currentHeight) > 10) {
                    iframe.style.height = newHeight + "px";
                    currentHeight = newHeight;
                }
            }, false);

            setTimeout(function() {
                const body = document.body || document.documentElement;
                const computedStyle = window.getComputedStyle(body);
                
                const linkElement = document.querySelector('a');
                const buttonElement = document.querySelector('button');
                
                const colors = {
                    textColor: computedStyle.color,
                    backgroundColor: computedStyle.backgroundColor,
                    linkColor: linkElement ? window.getComputedStyle(linkElement).color : computedStyle.color,
                    borderColor: computedStyle.borderColor || '#ddd',
                    buttonColor: buttonElement ? window.getComputedStyle(buttonElement).backgroundColor : '#2563eb'
                };

                iframe.contentWindow.postMessage({
                    type: 'wp-theme',
                    colors: colors,
                    isDark: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
                }, appUrl);
            }, 500);
        });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('logic_analyzer', 'logic_analyzer_embed_responsive_shortcode');

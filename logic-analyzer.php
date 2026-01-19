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
    $iframe_url = 'https://logic-analyzer.vercel.app/';
    $iframe_id = 'logic-analyzer-iframe-' . uniqid();

    ob_start();
    ?>
    <div style="width: 100%; max-width: 1000px; margin: 20px auto;">
        <iframe
            id="<?php echo esc_attr($iframe_id); ?>"
            src="<?php echo esc_url($iframe_url); ?>"
            style="width: 100%; border: none; height: 600px; display: block; overflow: hidden; transition: height 0.3s ease-in-out;"
            scrolling="no"
            title="Italian Logical Analysis Tool"
            allow="microphone">
        </iframe>
    </div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            const iframe = document.getElementById('<?php echo esc_js($iframe_id); ?>');
            let currentHeight = 600;

            window.addEventListener("message", function(event) {
                if (event.origin !== "https://logic-analyzer.vercel.app") {
                    return;
                }
                
                console.log('event.data', event.data);
                if (event.data && typeof event.data.height === "number") {
                    const newHeight = event.data.height;
                    if (Math.abs(newHeight - currentHeight) > 10) {
                        // iframe.style.height = newHeight + "px";
                        currentHeight = newHeight;
                    }
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
                }, 'https://logic-analyzer.vercel.app');
            }, 500);
        });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('logic_analyzer', 'logic_analyzer_embed_responsive_shortcode');

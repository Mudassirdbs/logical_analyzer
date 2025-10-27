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

    $output = '
        <div style="width: 100%; max-width: 1000px; margin: 20px auto;">
            <iframe
                id="' . esc_attr($iframe_id) . '"
                src="' . esc_url($iframe_url) . '"
                style="width: 100%; border: none; height: 800px; display: block; overflow: hidden; transition: height 0.3s ease-in-out;"
                scrolling="no"
                title="Italian Logical Analysis Tool"
                allow="microphone">
            </iframe>
        </div>
        <script>
            document.addEventListener("DOMContentLoaded", function() {
                const iframe = document.getElementById("' . esc_js($iframe_id) . '");

                window.addEventListener("message", function(event) {
                    if (event.origin !== "https://logic-analyzer.vercel.app") {
                        console.warn("Message from untrusted origin ignored:", event.origin);
                        return;
                    }

                    if (event.data && typeof event.data.height === "number") {
                        const newHeight = event.data.height;
                        iframe.style.height = (newHeight + 20) + "px";
                    }
                }, false);
            });
        </script>
    ';

    return $output;
}
add_shortcode('logic_analyzer', 'logic_analyzer_embed_responsive_shortcode');

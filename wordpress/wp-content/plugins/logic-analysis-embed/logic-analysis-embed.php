<?php
/**
 * Plugin Name: Logic Analysis Embed
 * Description: Incorpora l'app di Analisi Logica tramite un iframe con URL configurabile da Impostazioni.
 * Version: 1.0.0
 * Author: Your Name
 * License: GPLv2 or later
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Option keys
const LAE_OPTION_SRC    = 'lae_src';
const LAE_OPTION_WIDTH  = 'lae_width';
const LAE_OPTION_HEIGHT = 'lae_height';
const LAE_OPTION_ALLOW  = 'lae_allow';
const LAE_OPTION_SANDBOX = 'lae_sandbox';

/**
 * Set default options on activation
 */
function lae_activate() {
    if ( get_option( LAE_OPTION_SRC ) === false ) {
        add_option( LAE_OPTION_SRC, 'https://your-next-app.example.com' );
    }
    if ( get_option( LAE_OPTION_WIDTH ) === false ) {
        add_option( LAE_OPTION_WIDTH, '100%' );
    }
    if ( get_option( LAE_OPTION_HEIGHT ) === false ) {
        add_option( LAE_OPTION_HEIGHT, '800' );
    }
    if ( get_option( LAE_OPTION_ALLOW ) === false ) {
        // microphone needed for speech input
        add_option( LAE_OPTION_ALLOW, 'clipboard-write; microphone' );
    }
    if ( get_option( LAE_OPTION_SANDBOX ) === false ) {
        // relaxed enough for modern apps but still constrained
        add_option( LAE_OPTION_SANDBOX, 'allow-scripts allow-same-origin allow-forms allow-popups' );
    }
}
register_activation_hook( __FILE__, 'lae_activate' );

/**
 * Add settings link in the admin menu
 */
function lae_admin_menu() {
    add_options_page(
        __( 'Logic Analysis Embed', 'lae' ),
        __( 'Logic Analysis Embed', 'lae' ),
        'manage_options',
        'lae-settings',
        'lae_render_settings_page'
    );
}
add_action( 'admin_menu', 'lae_admin_menu' );

/**
 * Register settings
 */
function lae_register_settings() {
    register_setting( 'lae_settings_group', LAE_OPTION_SRC, [ 'type' => 'string', 'sanitize_callback' => 'esc_url_raw', 'default' => '' ] );
    register_setting( 'lae_settings_group', LAE_OPTION_WIDTH, [ 'type' => 'string', 'sanitize_callback' => 'lae_sanitize_dimension', 'default' => '100%' ] );
    register_setting( 'lae_settings_group', LAE_OPTION_HEIGHT, [ 'type' => 'string', 'sanitize_callback' => 'lae_sanitize_dimension', 'default' => '800' ] );
    register_setting( 'lae_settings_group', LAE_OPTION_ALLOW, [ 'type' => 'string', 'sanitize_callback' => 'lae_sanitize_text_attr', 'default' => 'clipboard-write; microphone' ] );
    register_setting( 'lae_settings_group', LAE_OPTION_SANDBOX, [ 'type' => 'string', 'sanitize_callback' => 'lae_sanitize_text_attr', 'default' => 'allow-scripts allow-same-origin allow-forms allow-popups' ] );
}
add_action( 'admin_init', 'lae_register_settings' );

/**
 * Sanitize width/height values (px or %)
 */
function lae_sanitize_dimension( $value ) {
    $value = trim( (string) $value );
    if ( preg_match( '/^\d+$/', $value ) ) {
        return $value; // treat as px height (numeric)
    }
    if ( preg_match( '/^\d+%$/', $value ) ) {
        return $value; // percentages
    }
    if ( preg_match( '/^\d+px$/', $value ) ) {
        return $value; // explicit px
    }
    return '100%';
}

/**
 * Sanitize allow/sandbox attributes (basic strip)
 */
function lae_sanitize_text_attr( $value ) {
    $value = wp_strip_all_tags( (string) $value );
    $value = preg_replace( '/[^a-zA-Z0-9;\- _]/', '', $value );
    return trim( $value );
}

/**
 * Render settings page
 */
function lae_render_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    ?>
    <div class="wrap">
        <h1><?php echo esc_html( __( 'Logic Analysis Embed – Impostazioni', 'lae' ) ); ?></h1>
        <form method="post" action="options.php">
            <?php settings_fields( 'lae_settings_group' ); ?>
            <?php do_settings_sections( 'lae_settings_group' ); ?>

            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="lae_src"><?php esc_html_e( 'URL iframe (src)', 'lae' ); ?></label></th>
                    <td>
                        <input name="<?php echo esc_attr( LAE_OPTION_SRC ); ?>" id="lae_src" type="url" class="regular-text" value="<?php echo esc_attr( get_option( LAE_OPTION_SRC ) ); ?>" placeholder="https://example.com" required />
                        <p class="description"><?php esc_html_e( 'Inserisci l\'URL pubblico della tua app (HTTPS consigliato).', 'lae' ); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="lae_width"><?php esc_html_e( 'Larghezza', 'lae' ); ?></label></th>
                    <td>
                        <input name="<?php echo esc_attr( LAE_OPTION_WIDTH ); ?>" id="lae_width" type="text" value="<?php echo esc_attr( get_option( LAE_OPTION_WIDTH, '100%' ) ); ?>" />
                        <p class="description"><?php esc_html_e( 'Esempi: 100%, 800px', 'lae' ); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="lae_height"><?php esc_html_e( 'Altezza', 'lae' ); ?></label></th>
                    <td>
                        <input name="<?php echo esc_attr( LAE_OPTION_HEIGHT ); ?>" id="lae_height" type="text" value="<?php echo esc_attr( get_option( LAE_OPTION_HEIGHT, '800' ) ); ?>" />
                        <p class="description"><?php esc_html_e( 'Esempi: 800 (px), 900px', 'lae' ); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="lae_allow"><?php esc_html_e( 'Attributo allow', 'lae' ); ?></label></th>
                    <td>
                        <input name="<?php echo esc_attr( LAE_OPTION_ALLOW ); ?>" id="lae_allow" type="text" class="regular-text" value="<?php echo esc_attr( get_option( LAE_OPTION_ALLOW, 'clipboard-write; microphone' ) ); ?>" />
                        <p class="description"><?php esc_html_e( 'Permessi come "clipboard-write; microphone" per abilitare microfono/dettatura.', 'lae' ); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="lae_sandbox"><?php esc_html_e( 'Attributo sandbox', 'lae' ); ?></label></th>
                    <td>
                        <input name="<?php echo esc_attr( LAE_OPTION_SANDBOX ); ?>" id="lae_sandbox" type="text" class="regular-text" value="<?php echo esc_attr( get_option( LAE_OPTION_SANDBOX, 'allow-scripts allow-same-origin allow-forms allow-popups' ) ); ?>" />
                        <p class="description"><?php esc_html_e( 'Controlla cosa è consentito nell\'iframe. Lascia vuoto per rimuovere l\'attributo.', 'lae' ); ?></p>
                    </td>
                </tr>
            </table>

            <?php submit_button(); ?>
        </form>

        <h2><?php esc_html_e( 'Utilizzo', 'lae' ); ?></h2>
        <p><?php esc_html_e( 'Aggiungi questo shortcode dove vuoi visualizzare l\'app:', 'lae' ); ?></p>
        <pre><code>[logic_analysis]</code></pre>
        <p><?php esc_html_e( 'Puoi anche sovrascrivere le impostazioni:', 'lae' ); ?></p>
        <pre><code>[logic_analysis src="https://example.com" width="100%" height="900" allow="clipboard-write; microphone"]</code></pre>
    </div>
    <?php
}

/**
 * Shortcode to render the iframe
 */
function lae_iframe_shortcode( $atts = [] ) {
    $atts = shortcode_atts([
        'src'    => get_option( LAE_OPTION_SRC, '' ),
        'width'  => get_option( LAE_OPTION_WIDTH, '100%' ),
        'height' => get_option( LAE_OPTION_HEIGHT, '800' ),
        'allow'  => get_option( LAE_OPTION_ALLOW, 'clipboard-write; microphone' ),
        'sandbox'=> get_option( LAE_OPTION_SANDBOX, 'allow-scripts allow-same-origin allow-forms allow-popups' ),
    ], $atts, 'logic_analysis' );

    $src    = esc_url( $atts['src'] );
    if ( empty( $src ) ) {
        return '<div class="lae-embed-error">'. esc_html__( 'Errore: URL iframe non configurato. Vai su Impostazioni → Logic Analysis Embed.', 'lae' ) .'</div>';
    }

    $width  = esc_attr( $atts['width'] );
    $height = esc_attr( $atts['height'] );
    $allow  = esc_attr( $atts['allow'] );
    $sandbox = trim( (string) $atts['sandbox'] );

    $wrapper_style = 'position:relative;padding-top:0;height:' . $height . (preg_match('/^\d+$/',$height) ? 'px' : '') . ';';
    $iframe_style  = 'border:0;width:' . $width . ';height:100%;';

    $sandbox_attr = $sandbox !== '' ? ' sandbox="' . esc_attr( $sandbox ) . '"' : '';

    $html  = '<div class="lae-embed" style="'. $wrapper_style .'">';
    $html .= '<iframe src="'. $src .'" style="'. $iframe_style .'" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allow="'. $allow .'"'. $sandbox_attr .'></iframe>';
    $html .= '</div>';
    return $html;
}
add_shortcode( 'logic_analysis', 'lae_iframe_shortcode' );



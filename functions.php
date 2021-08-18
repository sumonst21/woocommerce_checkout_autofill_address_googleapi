<?php
// woocommerce checkout address autocomplete
function woo_address_autocomplete_lib() {
	if(is_checkout() && !is_order_received_page())
	{
	  wp_enqueue_script( 'woo-address-autocomplete', get_template_directory_uri() . '/frontend_scripts.js', false );
		echo '<script src="https://maps.googleapis.com/maps/api/js?key="GOOGLEMAPS_API_HERE"&#038;libraries=places&#038;ver=1.0.0" id="google-maps-js-js"></script>';
		echo '<script id="gac-frontend-script-js-extra"> var gac_google_address = {"allowed_countries":"\"\"","combined":"yes","nofield":"yes","showmap":"yes","default":"CA","zoom":"3"}; </script>';
	}
}
add_action( 'wp_footer', 'woo_address_autocomplete_lib');

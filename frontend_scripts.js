( function( $ ) {
'use strict';
var billing_dragged = false;
var shipping_dragged = false;
	var full_address = '';
	function geocodeBillingPosition( pos, gacgeocoder ) {
		gacgeocoder.geocode({
		latLng: pos
		}, function(responses, status) {
			if (responses && responses.length > 0) {
				jQuery('#gac_auto_complete_billing_address').val(responses[0].formatted_address);
				full_address = responses[0].formatted_address;
				gac_fill_billing_fields(responses[0]);
				billing_dragged = true;
			}
		});
	}
	function geocodeShippingPosition( pos, gacgeocoder ) {
		gacgeocoder.geocode({
		latLng: pos
		}, function(responses) {
			if (responses && responses.length > 0) {
				jQuery('#gac_auto_complete_shipping_address').val(responses[0].formatted_address);
				gac_fill_shipping_fields(responses[0]);
				shipping_dragged = true;
			}
		});
	}
	function gac_fill_billing_fields( place ) {
		var address_2 = '';
		var address_1 = '';
		for ( var i = 0; i < place.address_components.length; i++ ) {
			console.log(place.address_components[i]);
			if ( jQuery.inArray('street_number', place.address_components[i].types) != -1 ) {
				if ( gac_google_address.combined == 'yes' ) {
					address_1 = place.address_components[i].long_name;
				}else{
					jQuery('#billing_address_1').val(place.address_components[i].long_name);
				}
			} else if ( jQuery.inArray('route', place.address_components[i].types) != -1 ) {
				if ( gac_google_address.combined == 'yes' ) {
					address_2 = place.address_components[i].long_name;
				}else{
					jQuery('#billing_address_2').val(place.address_components[i].long_name);
				}
			} else if ( jQuery.inArray('sublocality_level_1', place.address_components[i].types) != -1 || jQuery.inArray('locality', place.address_components[i].types) != -1 ) {
				jQuery('#billing_city').val(place.address_components[i].long_name);
			} else if ( jQuery.inArray('administrative_area_level_2', place.address_components[i].types) != -1 || jQuery.inArray('administrative_area_level_3', place.address_components[i].types) != -1 ) {
				if ( jQuery.inArray('administrative_area_level_1', place.address_components[i].types) ) {
					jQuery('#billing_city').val(place.address_components[i].long_name);
				}
			} else if ( jQuery.inArray('country', place.address_components[i].types) != -1 ) {
				jQuery('#billing_country').val(place.address_components[i].short_name);
				jQuery('#billing_country').trigger('change');
			} else if ( jQuery.inArray('postal_code', place.address_components[i].types) != -1 ) {
				jQuery('#billing_postcode').val(place.address_components[i].long_name);
			}
			if ( jQuery.inArray('administrative_area_level_1', place.address_components[i].types) != -1 ) {
				var state_short = place.address_components[i].short_name;
				var state_long = place.address_components[i].long_name;
				setTimeout(function(){
					if ( jQuery('#billing_state').prop('tagName') == 'SELECT' ) {
						jQuery('#billing_state').val(state_short);
						jQuery('#billing_state').find('option').each(function() {
							if ( state_short == jQuery(this).text() ) {
								jQuery(this).prop('selected', true);
								return true;
							}
						});
						jQuery('#billing_state').trigger('change');
					} else {
						jQuery('#billing_state').val(state_long);
					}
				}, 100);
			}
		}
		if ( gac_google_address.combined == 'yes' ) {
			jQuery('#billing_address_1').val(address_1+' '+address_2);
		}
		billing_dragged = false;
	}
	function gac_fill_shipping_fields( place ) {
		var address_1 = '';
		var address_2 = '';
		for ( var i = 0; i < place.address_components.length; i++ ) {
			if ( place.address_components[i].types[0] == 'street_number' ) {
				if ( gac_google_address.combined == 'yes' ) {
					address_1 = place.address_components[i].long_name;
				}else{
					jQuery('#shipping_address_1').val(place.address_components[i].long_name);
				}
			} else if ( place.address_components[i].types[0] == 'route' ) {
				if ( gac_google_address.combined == 'yes' ) {
					address_2 = place.address_components[i].long_name;
				}else{
					jQuery('#shipping_address_2').val(place.address_components[i].long_name);
				}
			} else if ( place.address_components[i].types[0] == 'sublocality_level_1' || place.address_components[i].types[0] == 'locality' ) {
				jQuery('#shipping_city').val(place.address_components[i].long_name);
			} else if ( place.address_components[i].types[0] == 'administrative_area_level_2' || place.address_components[i].types[0] == 'administrative_area_level_3' ) {
				if ( jQuery('#shipping_city').val() == '' && place.address_components[i].types[0] == 'administrative_area_level_1' ) {
					jQuery('#shipping_city').val(place.address_components[i].long_name);
				}
			} else if ( place.address_components[i].types[0] == 'country' ) {
				jQuery('#shipping_country').val(place.address_components[i].short_name);
				jQuery('#shipping_country').trigger('change');
			} else if ( place.address_components[i].types[0] == 'postal_code' ) {
				jQuery('#shipping_postcode').val(place.address_components[i].long_name);
			}
			if ( place.address_components[i].types[0] == 'administrative_area_level_1' ) {
				var state_short = place.address_components[i].short_name;
				var state_long = place.address_components[i].long_name;
				setTimeout(function(){
					if ( jQuery('#shipping_state').prop('tagName') == 'SELECT' ) {
						jQuery('#shipping_state').val(state_short);
						jQuery('#shipping_state').find('option').each(function() {
							if ( state_short == jQuery(this).text() ) {
								jQuery(this).prop('selected', true);
								return true;
							}
						});
						jQuery('#shipping_state').trigger('change');
					} else {
						jQuery('#shipping_state').val(state_long);
					}
				}, 100);
			}
		}
		if ( gac_google_address.combined == 'yes' ) {
			jQuery('#shipping_address_1').val(address_1+' '+address_2);
		}
		shipping_dragged = false;
	}
	function gacinitialize() {
		if ('yes' == gac_google_address.nofield ) {
			var billing = document.getElementById('billing_address_1');
		}else{
			var billing = document.getElementById('gac_auto_complete_billing_address');
		}
		var billing_address = new google.maps.places.Autocomplete(billing);
		if ( jQuery.parseJSON(gac_google_address.allowed_countries) != '' ) {
			billing_address.setComponentRestrictions(
			{'country': jQuery.parseJSON(gac_google_address.allowed_countries)});
		}
		google.maps.event.addListener(billing_address, 'place_changed', function () {
			var place = billing_address.getPlace();
			gac_fill_billing_fields(place);
		});
		// shipping
		if ('yes' == gac_google_address.nofield ) {
			var shipping = document.getElementById('shipping_address_1');
		}else{
			var shipping = document.getElementById('gac_auto_complete_shipping_address');
		}
		var shipping_address = new google.maps.places.Autocomplete(shipping);
		if ( jQuery.parseJSON(gac_google_address.allowed_countries) != '' ) {
			shipping_address.setComponentRestrictions(
				{'country': jQuery.parseJSON(gac_google_address.allowed_countries)});
		}
		google.maps.event.addListener(shipping_address, 'place_changed', function () {
			var place = shipping_address.getPlace();
			gac_fill_shipping_fields(place);
		});
	}
	function  gac_autocomplete_addresspicker() {
		if ( jQuery(document).find('#gac_autocomplete_billing_map').length > 0 ) {
		   	var gacbillingmarker;
			var oldbillingMarker;
			var gacMapOptions = {
				scrollwheel: true,
				zoom: parseInt(gac_google_address.zoom),
				center: { lat: 23.634501, lng: -102.552788 }
			};
			//display default address on map
			var gacbillingmap = new google.maps.Map(document.getElementById('gac_autocomplete_billing_map'), gacMapOptions);
			var old_country = jQuery('#billing_country').val();
			jQuery('#billing_address_1, #billing_address_2, #billing_city, #billing_country, #billing_state, #billing_postcode').change(function () {
				var new_country = jQuery('#billing_country').val();
				setTimeout(function(){
				if ( new_country != old_country ) {
					var addressString = jQuery('#billing_country option:selected').text();
				} else {
					var addressString = jQuery('#billing_address_1').val();
					addressString = (jQuery('#billing_address_2').val()) ? (addressString+" "+ jQuery('#billing_address_2').val()) : addressString;
					addressString = (jQuery('#billing_city').val()) ? (addressString+", "+ jQuery('#billing_city').val()) : addressString;
					addressString = (jQuery('#billing_state').val()) ? (addressString+" "+ jQuery('#billing_state').val()) : addressString;
					addressString = (jQuery('#billing_country option:selected').text()) ? (addressString+" "+ jQuery('#billing_country option:selected').text()) : addressString;
					addressString = (jQuery('#billing_postcode').val()) ? (addressString+" "+ jQuery('#billing_postcode').val()) : addressString;
				}
				if ( !billing_dragged ) {
					var gacaddress = (addressString) ? addressString : gac_google_address.default;
					var gacgeocoder = new google.maps.Geocoder();
					gacgeocoder.geocode({'address': gacaddress}, function (results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							var currentbillingLatLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
							gacbillingmarker = new google.maps.Marker({
								position: currentbillingLatLng,
								draggable: true,
								animation: google.maps.Animation.DROP,
								map: gacbillingmap
							});
							google.maps.event.addListener(gacbillingmarker, 'dragend', function() {
								geocodeBillingPosition(gacbillingmarker.getPosition(), gacgeocoder);
								billing_dragged = true;
							});
							if (oldbillingMarker != undefined) {
								oldbillingMarker.setMap(null);
							}
							oldbillingMarker = gacbillingmarker;
							gacbillingmap.setCenter(currentbillingLatLng);
						}
					});
				}
				}, 2000);
			});
			jQuery('#billing_address_1').trigger('change');
		}
		if ( jQuery(document).find('#gac_autocomplete_shipping_map').length > 0 ){
			var gacshippingmarker;
			var oldshippingMarker;
			var gacMapOptions = {
				scrollwheel: true,
				zoom: parseInt(gac_google_address.zoom),
				center: { lat: 23.634501, lng: -102.552788 }
			};
			//display default address on map
			var gacshippingmap = new google.maps.Map(document.getElementById('gac_autocomplete_shipping_map'), gacMapOptions);
			var old_country = jQuery('#shipping_country').val();
			jQuery('#shipping_address_1, #shipping_address_2, #shipping_city, #shipping_country, #shipping_state, #shipping_postcode').change(function () {
				var new_country = jQuery('#shipping_country').val();
				setTimeout(function(){
				if ( new_country != old_country ) {
					var addressString = jQuery('#shipping_country option:selected').text();
				} else {
					var addressString = jQuery('#shipping_address_1').val();
					addressString = (jQuery('#shipping_address_2').val()) ? (addressString+" "+ jQuery('#shipping_address_2').val()) : addressString;
					addressString = (jQuery('#shipping_city').val()) ? (addressString+", "+ jQuery('#shipping_city').val()) : addressString;
					addressString = (jQuery('#shipping_state').val()) ? (addressString+" "+ jQuery('#shipping_state').val()) : addressString;
					addressString = (jQuery('#shipping_country option:selected').text()) ? (addressString+" "+ jQuery('#shipping_country option:selected').text()) : addressString;
					addressString = (jQuery('#shipping_postcode').val()) ? (addressString+" "+ jQuery('#shipping_postcode').val()) : addressString;
				}
				if ( !shipping_dragged ) {
					var gacaddress = (addressString) ? addressString : gac_google_address.default;
					var gacgeocoder = new google.maps.Geocoder();
					gacgeocoder.geocode({'address': gacaddress}, function (results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							var currentshippingLatLng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
							gacshippingmarker = new google.maps.Marker({
								position: currentshippingLatLng,
								draggable: true,
								animation: google.maps.Animation.DROP,
								map: gacshippingmap
							});
							google.maps.event.addListener(gacshippingmarker, 'dragend', function() {
								geocodeShippingPosition(gacshippingmarker.getPosition(), gacgeocoder);
								shipping_dragged = true;
							});
							if (oldshippingMarker != undefined) {
								oldshippingMarker.setMap(null);
							}
							oldshippingMarker = gacshippingmarker;
							gacshippingmap.setCenter(currentshippingLatLng);
						}
					});
				}
				}, 2000);
			});
			jQuery('#shipping_address_1').trigger('change');
		}
	}
    jQuery( document ).ready( function() {
		if ( 'yes' == gac_google_address.showmap ) {
		   if('yes' == gac_google_address.nofield){
			  jQuery('#billing_address_1_field').append('<div class="gac_autocomplete_billing_map" id="gac_autocomplete_billing_map"></div>');
			  jQuery('#shipping_address_1_field').append('<div class="gac_autocomplete_shipping_map" id="gac_autocomplete_shipping_map"></div>');
		   }else{
			  jQuery('#gac_auto_complete_billing_address_field').append('<div class="gac_autocomplete_billing_map" id="gac_autocomplete_billing_map"></div>');
			  jQuery('#gac_auto_complete_shipping_address_field').append('<div class="gac_autocomplete_shipping_map" id="gac_autocomplete_shipping_map"></div>');
		   }
		   gac_autocomplete_addresspicker();
		}
		if ( jQuery('#billing_address_1').length > 0 || jQuery('#shipping_address_1').length > 0 ) {
			gacinitialize();
		   google.maps.event.addDomListener(window, 'load', gacinitialize);
		}
	});
})(jQuery);
/**
 * Edit in Place - a jQuery plugin for editing text content in place
 * and doing anything you want with the change. One nice feature is 
 * that you can revert to the original value by hitting escape while 
 * editing. 
 * 
 * Note: Only works with elements that just have a text node and no 
 * child nodes.
 *
 * Usage:
 *
 * $someElement.editInPlace({
 * 
 * 		onChange: function( $el ){
 * 			// Do something with the $el when its text changes
 * 	  	}
 * 	  	
 * });
 *
 * If you want to restore a particular element to its original value:
 * 
 * $someElement.editInPlace('revert');
 *
 *
 * If you want to remove editing capacity:
 * 
 * $someElement.editInPlace('destroy');
 *
 * 
 */
;(function ( $, window, document, undefined ) {

	// Config Defaults
	var pluginName = "editInPlace",
		defaults = {
			onChange: function( $el ){
				console.log('Content change detected to:');
				console.log( $el );
			}
		};

	// The actual plugin constructor
	function Plugin( element, options ) {

		this.element = element;

		if( options === 'destroy' ){
			this.destroy();
		} else if( options === 'revert' ){
			this.revert();
		} else {
			this.options = $.extend( {}, defaults, options);
			this.init();
		}

	}

	Plugin.prototype = {

		init: function() {

			var $el = $(this.element);

			// On focus, save first and current value in case of revert
			$el.on('focus.eip', function(e){

				// If this is the first focus, store original val
				if( ! $el.data( 'eipOriginalVal' ) )
					$el.data( 'eipOriginalVal', $el.text() );

				// Store the val that was there where editing began
				$el.data('eipLastVal', $el.text() );

			});

			// Esc -> Revert, Enter -> break out of editing
			$el.on('keydown.eip', function(e){

				if( e.which == 13 ){

					e.preventDefault();

					$el.blur();

				} else if( e.which == 27) {

					var original_val = $el.data('eipLastVal');

					$el.text(original_val);

					$el.blur();
				}

			});

			/**
			 * Check for a change in content
			 * and signal if there is one.
			 */
			$el.on('blur.eip', function(e){

				if( $el.data('eipLastVal') !== $el.text() )
					$el.trigger('change.eip');

			});

			/**
			 * When a change is detected, write the new
			 * value to data and run the spefified onChange handler
			 */
			$el.on('change.eip', $.proxy( function(e){
				$el.data('eipLastVal', $el.text() );
				this.options.onChange( $el );
			}, this ) );

			$el.prop('contenteditable', true);

		}, // init

		/**
		 * Unbinds listeners and removes 'contenteditable' prop
		 */
		destroy: function(){

			$(this.element)
				.off('.eip')
				.prop('contenteditable', false);

		},

		/**
		 * Restores an element's original value
		 */
		revert: function(){

			var $el = $(this.element),
				originalValue = $el.data( 'eipOriginalVal' );

			if( originalValue )
				$el.text( originalValue );
		}

	};


	$.fn[pluginName] = function ( options ) {

		return this.each(function () {

			if( options === 'destroy'){

				$.data(this, "plugin_" + pluginName, false);
				new Plugin( this, 'destroy' );

			} else if( options === 'revert' ){

				new Plugin( this, 'revert' );

			} else if ( ! $.data(this, "plugin_" + pluginName) ) {

				$.data(this, "plugin_" + pluginName,
				new Plugin( this, options ));

			}
		});
	};

})( jQuery, window, document );
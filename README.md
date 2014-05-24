jQuery.edit-in-place
====================

jQuery plugin for editing text content in place and doing anything you want with the change. One nice feature is that you can revert to the original value by hitting escape while editing. 

Note: Editing only works with elements that just have a text node and no child nodes.

Usage:
------

```javascript
$someElement.editInPlace({

		onChange: function( $el ){
			// Do something with the $el when its text changes
	  	}
	  	
});
```

If you want to restore a particular element to its original value:

```javascript
$someElement.editInPlace('revert');
```

If you want to remove editing capacity:

```javascript
$someElement.editInPlace('destroy');
```




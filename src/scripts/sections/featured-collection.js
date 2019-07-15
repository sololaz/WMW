/**
 * Section: Featured collection
 * ------------------------------------------------------------------------------
 * Featured collection configuration for complete theme support
 * - https://github.com/Shopify/theme-scripts/tree/master/packages/theme-sections
 *
 * @namespace featuredCollection
 */
import {register} from '@shopify/theme-sections';

/**
 * Featured collection constructor
 * Executes on page load as well as Theme Editor `section:load` events.
 *
 * @param {string} container - selector for the section container DOM element
 */
register('featured-collection', {

  init() {
    window.console.log('Initialising featured collection section');
    
  },

  publicMethod() {
    // Custom public section method
  },

  _privateMethod() {
    // Custom private section method
  },

  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad() {
    // Do something when a section instance is loaded
    this.init();
  },

  // Shortcut function called when a section unloaded by the Theme Editor 'shopify:section:unload' event.
  onUnload() {
    // Do something when a section instance is unloaded
  },

  // Shortcut function called when a section is selected by the Theme Editor 'shopify:section:select' event.
  onSelect() {
    // Do something when a section instance is selected
  },

  // Shortcut function called when a section is deselected by the Theme Editor 'shopify:section:deselect' event.
  onDeselect() {
    // Do something when a section instance is selected
  },

  // Shortcut function called when a section block is selected by the Theme Editor 'shopify:block:select' event.
  onBlockSelect() {
    // Do something when a section block is selected
  },

  // Shortcut function called when a section block is deselected by the Theme Editor 'shopify:block:deselect' event.
  onBlockDeselect() {
    // Do something when a section block is deselected
  },
});


window.onload = function() {
Shopify.AjaxifyCart = (function($) {

  var _config = {
    
    addToCartBtnLabel:             'Add to cart',
    addedToCartBtnLabel:           'Thank you!',
    addingToCartBtnLabel:          'Adding...',
    soldOutBtnLabel:               'Sold Out',
    howLongTillBtnReturnsToNormal: 1000, // in milliseconds.
    cartCountSelector:             '#CartCount',
    cartTotalSelector:             '#cart-price',
    
    addToCartBtnSelector:          '[type="submit"]',
    addToCartFormSelector:         'form[action="/cart/add"]',
    shopifyAjaxAddURL:             '/cart/add.js',
    shopifyAjaxCartURL:            '/cart.js'
  };
  

  var _showFeedback = function(success, html, $addToCartForm) {
    $('.ajaxified-cart-feedback').remove();
    var feedback = '<p class="ajaxified-cart-feedback ' + success + '">' + html + '</p>';
    switch (_config.feedbackPosition) {
      case 'aboveForm':
        $addToCartForm.before(feedback);
        break;
      case 'belowForm':
        $addToCartForm.after(feedback);
        break;
      case 'nextButton':
      default:
        $addToCartForm.find(_config.addToCartBtnSelector).after(feedback);
        break;   
    }
   
  };
  var _setText = function($button, label) {
    if ($button.children().length) {
      $button.children().each(function() {
        if ($.trim($(this).text()) !== '') {
          $(this).text(label);
        }
      });
    }
    else {
      $button.val(label).text(label);
    }
  };
  var _init = function() {   
    $(document).ready(function() { 
      $(_config.addToCartFormSelector).submit(function(e) {
        e.preventDefault();
        var $addToCartForm = $(this);
        var $addToCartBtn = $addToCartForm.find(_config.addToCartBtnSelector);
        _setText($addToCartBtn, _config.addingToCartBtnLabel);
        $addToCartBtn.addClass('disabled').prop('disabled', true);
        // Add to cart.
        $.ajax({
          url: _config.shopifyAjaxAddURL,
          dataType: 'json',
          type: 'post',
          data: $addToCartForm.serialize(),
          success: function(itemData) {
            // Re-enable add to cart button.
            $addToCartBtn.addClass('inverted');
            _setText($addToCartBtn, _config.addedToCartBtnLabel);
            _showFeedback('success','',$addToCartForm);
            window.setTimeout(function(){
              $addToCartBtn.prop('disabled', false).removeClass('disabled').removeClass('inverted');
              _setText($addToCartBtn,_config.addToCartBtnLabel);
            }, _config.howLongTillBtnReturnsToNormal);
            // Update cart count and show cart link.
            $.getJSON(_config.shopifyAjaxCartURL, function(cart) {
              if (_config.cartCountSelector && $(_config.cartCountSelector).size()) {
                var value = $(_config.cartCountSelector).html() || '0';
                $(_config.cartCountSelector).html(value.replace(/[0-9]+/,cart.item_count)).removeClass('hidden-count');
              }
              if (_config.cartTotalSelector && $(_config.cartTotalSelector).size()) {
                if (typeof Currency !== 'undefined' && typeof Currency.moneyFormats !== 'undefined') {
                  var newCurrency = '';
                  if ($('[name="currencies"]').size()) {
                    newCurrency = $('[name="currencies"]').val();
                  }
                  else if ($('#currencies span.selected').size()) {
                    newCurrency = $('#currencies span.selected').attr('data-currency');
                  }
                  if (newCurrency) {
                    $(_config.cartTotalSelector).html('<span class=money>' + Shopify.formatMoney(Currency.convert(cart.total_price, "{{ shop.currency }}", newCurrency), Currency.money_format[newCurrency]) + '</span>');
                  } 
                  else {
                    $(_config.cartTotalSelector).html(Shopify.formatMoney(cart.total_price, "{{ shop.money_format | remove: ",'" | remove: ' ,"' }}"));
                  }
                }
                else {
                  $(_config.cartTotalSelector).html(Shopify.formatMoney(cart.total_price, "{{ shop.money_format | remove: ",'" | remove: ',"' }}"));
                }
              };
            });        
          }, 
          error: function(XMLHttpRequest) {
            var response = eval('(' + XMLHttpRequest.responseText + ')');
            response = response.description;
            if (response.slice(0,4) === 'All ') {
              _showFeedback('error', response.replace('All 1 ', 'All '), $addToCartForm);
              $addToCartBtn.prop('disabled', false);
              _setText($addToCartBtn, _config.soldOutBtnLabel);
              $addToCartBtn.prop('disabled',true);
            }
            else {
              _showFeedback('error', '<i class="fa fa-warning"></i> ' + response, $addToCartForm);
              $addToCartBtn.prop('disabled', false).removeClass('disabled');
              _setText($addToCartBtn, _config.addToCartBtnLabel);
            }
          }
        });   
        return false;    
      });
    });
  };
  return {
    init: function(params) {
        // Configuration
        params = params || {};
        // Merging with defaults.
        $.extend(_config, params);
        // Action
        $(function() {
          _init();
        });
    },    
    getConfig: function() {
      return _config;
    }
  }  
})(jQuery);

Shopify.AjaxifyCart.init();}
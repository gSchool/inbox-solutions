$(function () {

  // ---- INITIAL PAGE LOAD
  // ---- Loads selection state from sessionStorage
  var templateString = $('[data-template=message]').text();
  var $messagesContainer = $("[data-container=messages]");
  $.getJSON('/api/inbox.json').then(function (data) {
    data.messages.forEach(function (message) {
      var checked = sessionStorage.getItem('message-' + message.id);
      $messagesContainer.append(
        templateString
          .replace('{readClass}', message.read ? 'read' : 'unread')
          .replace('{checked}', checked ? 'checked' : '')
          .replace('{starClass}', message.starred ? 'fa-star' : 'fa-star-o')
          .replace('{selectedClass}', checked ? 'selected' : '')
          .replace('{subject}', message.subject)
          .replace('{messageId}', message.id)
      )
    });
  });

  // ---- User can select all messages
  // ---- User can deselect all messages
  // ---- Changing selection is saved in sessionStorage
  $('[data-behavior=multiselect]').on('click', function () {
    var $checkboxes = $messagesContainer.find(':checkbox');

    if ($checkboxes.filter(':checked').length > 0) {
      $(this).find('i')
        .removeClass('fa-check-square-o')
        .removeClass('fa-minus-square-o')
        .addClass('fa-square-o');

      $messagesContainer.find(':checkbox')
        .prop('checked', false)
        .closest('[data-message-id]')
        .removeClass('selected');

      $('[data-disableable]').prop('disabled', true);

      $messagesContainer.find('[data-message-id]').each(function () {
        sessionStorage.removeItem('message-' + $(this).data('message-id'));
      });
    } else {
      $(this).find('i')
        .removeClass('fa-square-o')
        .removeClass('fa-minus-square-o')
        .addClass('fa-check-square-o');

      $messagesContainer.find(':checkbox')
        .prop('checked', true)
        .closest('[data-message-id]')
        .addClass('selected');

      $('[data-disableable]').prop('disabled', false);

      $messagesContainer.find('[data-message-id]').each(function () {
        sessionStorage.setItem('message-' + $(this).data('message-id'), true);
      });
    }
  });

  // ---- User can select an individual message
  // ---- User can deselect an individual message
  // ---- Changing selection is saved in sessionStorage
  $('[data-container=messages]').on('change', ':checkbox', function () {
    var $message = $(this).closest('[data-message-id]');
    var $checkboxes = $messagesContainer.find(':checkbox');
    var $multiselect = $('[data-behavior=multiselect]');

    if ($(this).is(':checked')) {
      $message.addClass('selected');
      sessionStorage.setItem('message-' + $message.data('message-id'), true);
    } else {
      $message.removeClass('selected');
      sessionStorage.removeItem( 'message-' + $message.data('message-id') );
    }

    if ($checkboxes.filter(':checked').length === $checkboxes.length) {
      $multiselect.find('i')
        .removeClass('fa-square-o')
        .removeClass('fa-minus-square-o')
        .addClass('fa-check-square-o');
      $('[data-disableable]').prop('disabled', false);
    } else if ($checkboxes.filter(':checked').length === 0) {
      $multiselect.find('i')
        .removeClass('fa-check-square-o')
        .removeClass('fa-minus-square-o')
        .addClass('fa-square-o');
      $('[data-disableable]').prop('disabled', true);
    } else {
      $multiselect.find('i')
        .removeClass('fa-square-o')
        .removeClass('fa-check-square-o')
        .addClass('fa-minus-square-o');
      $('[data-disableable]').prop('disabled', false);
    }
  });

  // ---- User can star a message
  // ---- User can unstar a message
  $('[data-container=messages]').on('click', '[data-star]', function () {
    var $star = $(this);

    if ($star.hasClass('fa-star-o')) {
      $star.removeClass('fa-star-o').addClass('fa-star');
    } else {
      $star.removeClass('fa-star').addClass('fa-star-o');
    }
    return false;
  });

});

/*

The following is an example of the DOM-as-data approach to
jQuery.  With the exception of the initial data loading,
there are no separate data structures (no models).

The code below demonstrates very primitive templating,
without requiring Mustache or Handlebars or any other
templating engine.

No attempt has been made to DRY up the code, or otherwise
make the code easy to maintain.  It is intentionally written
in a very procedural style that should be relatively easy to
follow.  You will see long, complex functions, duplication,
tight-coupling of components and other violations of
commonly agreed-upon best practices for modern JavaScript code.

*/

$(function () {

  // ---- INITIAL PAGE LOAD
  // ---- Loads selection state from sessionStorage
  var TEMPLATES = {
    unreadMessageCount: $('[data-template=unread-message-count]').text(),
    message: $('[data-template=message]').text()
  };

  var $messagesContainer = $("[data-container=messages]");
  var $unreadMessageCountContainer = $("[data-container=unread-message-count]");

  $.getJSON('/api/messages').then(function (messages) {
    var selectedMessageCount = 0;
    var allLabels = [];
    messages.forEach(function (message) {
      message.labels.forEach(function (label) {
        if(allLabels.indexOf(label) === -1) allLabels.push(label);
      });
      var checked = sessionStorage.getItem('message-' + message._id);
      if (checked) selectedMessageCount++;

      var labels = message.labels.sort().map(function (label) {
        return '<span data-label class="label label-warning">' + label + '</span>';
      }).join('');

      $messagesContainer.append(
        TEMPLATES.message
          .replace('{readClass}', message.read ? 'read' : 'unread')
          .replace('{checked}', checked ? 'checked' : '')
          .replace('{starClass}', message.starred ? 'fa-star' : 'fa-star-o')
          .replace('{selectedClass}', checked ? 'selected' : '')
          .replace('{subject}', message.subject)
          .replace('{labels}', labels)
          .replace('{messageId}', message._id)
      )
    });

    var $multiselect = $('[data-behavior=multiselect]');

    allLabels.sort().reverse();
    allLabels.forEach(function (label) {
      $('[data-behavior=apply-label] option:first')
        .after('<option value="' + label + '">' + label + '</option>');
      $('[data-behavior=remove-label] option:first')
        .after('<option value="' + label + '">' + label + '</option>');
    });

    if(selectedMessageCount === 0) {
      $multiselect.find('i')
        .removeClass('fa-check-square-o')
        .removeClass('fa-minus-square-o')
        .addClass('fa-square-o');
      $('[data-disableable]').prop('disabled', true);
    } else if (selectedMessageCount === messages.length) {
      $multiselect.find('i')
        .removeClass('fa-square-o')
        .removeClass('fa-minus-square-o')
        .addClass('fa-check-square-o');
      $('[data-disableable]').prop('disabled', false);
    } else {
      $multiselect.find('i')
        .removeClass('fa-square-o')
        .removeClass('fa-check-square-o')
        .addClass('fa-minus-square-o');
      $('[data-disableable]').prop('disabled', false);
    }

    var unreadMessageCount = $('[data-message-id].unread').length;

    $unreadMessageCountContainer.html(
      TEMPLATES.unreadMessageCount
        .replace('{messageCount}', unreadMessageCount)
        .replace('{description}', 'unread ' + (unreadMessageCount === 1 ? 'message' : 'messages'))
    );
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
    var messageId = $star.closest('[data-message-id]').data('message-id');

    if ($star.hasClass('fa-star-o')) {
      $.post('/api/messages/' + messageId, {starred: true}).then(function () {
        $star.removeClass('fa-star-o').addClass('fa-star');
      });
    } else {
      $.post('/api/messages/' + messageId, {starred: false}).then(function () {
        $star.removeClass('fa-star').addClass('fa-star-o');
      });
    }
    return false;
  });

  // ---- User mark messages as read
  $('[data-behavior=mark-as-read]').on('click', function () {
    $('[data-message-id].selected')
      .addClass('read')
      .removeClass('unread');

    var unreadMessageCount = $('[data-message-id].unread').length;

    $unreadMessageCountContainer.html(
      TEMPLATES.unreadMessageCount
        .replace('{messageCount}', unreadMessageCount)
        .replace('{description}', 'unread ' + (unreadMessageCount === 1 ? 'message' : 'messages'))
    );
    return false;
  });

  // ---- User mark messages as unread
  $('[data-behavior=mark-as-unread]').on('click', function () {
    $('[data-message-id].selected')
      .addClass('unread')
      .removeClass('read');

    var unreadMessageCount = $('[data-message-id].unread').length;

    $unreadMessageCountContainer.html(
      TEMPLATES.unreadMessageCount
        .replace('{messageCount}', unreadMessageCount)
        .replace('{description}', 'unread ' + (unreadMessageCount === 1 ? 'message' : 'messages'))
    );
    return false;
  });

  // ---- User deletes messages
  $('[data-behavior=delete-message]').on('click', function () {
    $('[data-message-id].selected').remove();
    var unreadMessageCount = $('[data-message-id].unread').length;
    var $multiselect = $('[data-behavior=multiselect]');

    $unreadMessageCountContainer.html(
      TEMPLATES.unreadMessageCount
        .replace('{messageCount}', unreadMessageCount)
        .replace('{description}', 'unread ' + (unreadMessageCount === 1 ? 'message' : 'messages'))
    );

    $multiselect.find('i')
      .removeClass('fa-check-square-o')
      .removeClass('fa-minus-square-o')
      .addClass('fa-square-o');
    $('[data-disableable]').prop('disabled', true);

    return false;
  });

  // ---- User applies a label to messages
  // ---- Users can create new labels
  // ---- Users cannot create duplicate labels
  $('[data-behavior=apply-label]').on('change', function () {
    var value;
    if ($(this).find('option:selected').is('[data-behavior=new-label]')) {
      value = prompt('Enter the name of the new label:');
      value = value.trim().toLowerCase();
      if (value !== '') {
        var $options = $(this).find('option[value!=""]');
        var existingValues = $options.map(function () { return this.value; }).get();
        if (existingValues.indexOf(value) === -1) {
          $options.remove();
          $('[data-behavior=remove-label] option[value!=""]').remove();

          existingValues.push(value);
          existingValues.sort();
          existingValues.reverse()
          existingValues.forEach(function (label) {
            $('[data-behavior=apply-label]')
              .find('option:nth-child(1)')
              .after('<option value="' + label + '">' + label + '</option>');
            $('[data-behavior=remove-label]')
              .find('option:nth-child(1)')
              .after('<option value="' + label + '">' + label + '</option>');
          });
        }
      }
    } else {
      value = $(this).val();
    }
    if (value !== '') {
      $('[data-message-id].selected').each(function () {
        var $el = $(this).find('[data-container=info]');
        var labels = $el.find("[data-label]").map(function () {
          return this.innerHTML;
        }).get();
        if (labels.indexOf(value) === -1) {
          $el.find('[data-label]').remove();
          labels.push(value);
          labels.sort();
          labels.reverse()
          labels.forEach(function (label) {
            $el.prepend('<span data-label class="label label-warning">' + label + '</span>');
          });
        }
      });
    }
    this.selectedIndex = 0;
  });

  // ---- User removes labels from a message
  $('[data-behavior=remove-label]').on('change', function () {
    var value = $(this).val();

    $('[data-message-id].selected').each(function () {
      var $el = $(this).find('[data-container=info]');
      $el.find("[data-label]").each(function () {
        if (this.innerHTML === value) {
          $(this).remove();
        }
      });
    });
    this.selectedIndex = 0;
  });

});

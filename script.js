// Wait for the document to load before running the script 
(function ($) {
  
  // We use some Javascript and the URL #fragment to hide/show different parts of the page
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Linking_to_an_element_on_the_same_page
  $(window).on('load hashchange', function(){
    
    // First hide all content regions, then show the content-region specified in the URL hash 
    // (or if no hash URL is found, default to first menu item)
    $('.content-region').hide();
    
    // Remove any active classes on the main-menu
    $('.main-menu a').removeClass('active');
    var region = location.hash.toString() || $('.main-menu a:first').attr('href');
    
    // Now show the region specified in the URL hash
    $(region).show();
    
    // Highlight the menu link associated with this region by adding the .active CSS class
    $('.main-menu a[href="'+ region +'"]').addClass('active'); 

    // Alternate method: Use AJAX to load the contents of an external file into a div based on URL fragment
    // This will extract the region name from URL hash, and then load [region].html into the main #content div
    // var region = location.hash.toString() || '#first';
    // $('#content').load(region.slice(1) + '.html')
    
  });
  
})(jQuery);


// Auto-render reports list from REPORTS manifest (in reports.js)
function renderReports() {
  try {
    if (!Array.isArray(REPORTS)) return;
    // sort newest first by date field (YYYY-MM-DD)
    const sorted = [...REPORTS].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const ul = document.getElementById('report-list');
    if (!ul) return;
    ul.innerHTML = '';
    sorted.forEach(r => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = r.url;
      a.download = '';
      a.textContent = `${r.title} (${r.date})`;
      li.appendChild(a);
      ul.appendChild(li);
    });
  } catch (e) {
    console.error('Failed to render reports', e);
  }
}

// When the page loads or the hash changes, render the reports list once when #report is active.
(function(){
  let _reportsRendered = false;
  function maybeRenderReports(){
    const isReport = (location.hash === '#report');
    if (!_reportsRendered && isReport) {
      _reportsRendered = true;
      try { renderReports(); } catch(e) { console.error('Failed to render reports', e); }
    }
  }
  window.addEventListener('load', maybeRenderReports);
  window.addEventListener('hashchange', maybeRenderReports);
})();

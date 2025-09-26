document.addEventListener('DOMContentLoaded', () => {
  const appShell = document.querySelector('.app-shell');
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('[data-sidebar-toggle]');

  if (toggle && sidebar && appShell) {
    toggle.addEventListener('click', () => {
      const collapsed = sidebar.classList.toggle('sidebar--collapsed');
      appShell.classList.toggle('app-shell--sidebar-collapsed', collapsed);
      toggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }

  const currentPage = document.body.dataset.page;
  if (currentPage) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      if (link.dataset.page === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
});

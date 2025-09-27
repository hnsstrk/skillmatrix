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

  const themeToggle = document.querySelector('[data-theme-toggle]');
  const setTheme = (mode) => {
    const theme = mode === 'dark' ? 'dark' : 'light';
    document.body.dataset.theme = theme;
    if (themeToggle) {
      themeToggle.setAttribute('data-theme-mode', theme);
    }
    try {
      localStorage.setItem('asm-theme', theme);
    } catch (err) {
      /* ignore storage errors */
    }
  };

  if (themeToggle) {
    let initialTheme = document.body.dataset.theme || null;
    if (!initialTheme) {
      try {
        initialTheme = localStorage.getItem('asm-theme');
      } catch (err) {
        initialTheme = null;
      }
    }
    setTheme(initialTheme || 'light');

    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  const currentPage = document.body.dataset.page;
  if (currentPage) {
    const selectors = '.nav-link, .nav-sublink, .sidebar__footer-link';
    const navItems = document.querySelectorAll(selectors);
    navItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.page === currentPage);
    });

    const activeItem = document.querySelector(`[data-page="${currentPage}"]`);
    if (activeItem) {
      const section = activeItem.closest('.nav-section');
      if (section) {
        const parentLink = section.querySelector('.nav-link');
        if (parentLink && parentLink !== activeItem) {
          parentLink.classList.add('active');
        }
      }
    }
  }
});

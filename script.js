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

  const PROFILE_STORAGE_KEY = 'asm-selected-profile';
  const PROFILE_STORAGE_META_KEY = 'asm-selected-profile-meta';

  const parseTagsAttr = (value) => (value ? value.split('|').map((tag) => tag.trim()).filter(Boolean) : []);

  const readStoredMeta = () => {
    try {
      const raw = sessionStorage.getItem(PROFILE_STORAGE_META_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return null;
    }
  };

  const storeProfileSelection = (id, meta) => {
    try {
      sessionStorage.setItem(PROFILE_STORAGE_KEY, id);
      sessionStorage.setItem(PROFILE_STORAGE_META_KEY, JSON.stringify(meta));
    } catch (err) {
      /* storage optional */
    }
  };

  if (document.body.dataset.profilePage === 'list') {
    const memberLinks = document.querySelectorAll('[data-profile-link]');
    memberLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const id = link.getAttribute('data-profile-link');
        if (!id) return;
        const meta = {
          id,
          name: link.getAttribute('data-profile-name') || '',
          role: link.getAttribute('data-profile-role') || '',
          team: link.getAttribute('data-profile-team') || '',
          tags: parseTagsAttr(link.getAttribute('data-profile-tags'))
        };
        storeProfileSelection(id, meta);
      });
    });
  }

  if (document.body.dataset.profilePage === 'detail') {
    const dataElement = document.getElementById('developer-profile-data');
    let profiles = {};
    if (dataElement) {
      try {
        profiles = JSON.parse(dataElement.textContent || '{}');
      } catch (err) {
        profiles = {};
      }
    }

    const profileIds = Object.keys(profiles);

    const getStoredId = () => {
      try {
        return sessionStorage.getItem(PROFILE_STORAGE_KEY);
      } catch (err) {
        return null;
      }
    };

    const getHashId = () => {
      if (!window.location.hash) return null;
      return window.location.hash.replace('#', '').trim() || null;
    };

    const computeInitials = (name) => {
      if (!name) return '??';
      const parts = name.trim().split(/\s+/);
      const letters = parts.map((part) => part[0]).filter(Boolean).slice(0, 2);
      return letters.join('').toUpperCase();
    };

    const fillField = (field, value) => {
      const nodes = document.querySelectorAll('[data-profile-field="' + field + '"]');
      nodes.forEach((node) => {
        node.textContent = value || '—';
      });
    };

    const renderTags = (selector, tags, className, emptyLabel = 'Noch keine Skills hinterlegt') => {
      const container = document.querySelector(selector);
      if (!container) return;
      container.innerHTML = '';
      if (!tags || tags.length === 0) {
        if (emptyLabel) {
          const empty = document.createElement('span');
          empty.className = className;
          empty.textContent = emptyLabel;
          container.appendChild(empty);
        }
        return;
      }
      tags.forEach((tag) => {
        const chip = document.createElement('span');
        chip.className = className;
        chip.textContent = tag;
        container.appendChild(chip);
      });
    };

    const renderSkills = (skills) => {
      const body = document.querySelector('[data-profile-skills]');
      if (!body) return;
      body.innerHTML = '';
      if (!skills || skills.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.className = 'profile-skills__context';
        cell.textContent = 'Noch keine Skill-Daten verfügbar.';
        row.appendChild(cell);
        body.appendChild(row);
        return;
      }
      skills.forEach((skill) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = skill.name || 'Skill';
        row.appendChild(nameCell);

        const levelCell = document.createElement('td');
        const levelBadge = document.createElement('span');
        levelBadge.className = 'profile-skills__level';
        levelBadge.textContent = skill.level || '–';
        levelCell.appendChild(levelBadge);
        row.appendChild(levelCell);

        const contextCell = document.createElement('td');
        contextCell.className = 'profile-skills__context';
        contextCell.textContent = skill.context || 'Kontext folgt.';
        row.appendChild(contextCell);

        body.appendChild(row);
      });
    };

    const renderList = (selector, items, emptyMessage) => {
      const container = document.querySelector(selector);
      if (!container) return;
      container.innerHTML = '';
      if (!items || items.length === 0) {
        if (emptyMessage) {
          const li = document.createElement('li');
          li.className = 'profile-growth__item';
          const span = document.createElement('span');
          span.textContent = emptyMessage;
          li.appendChild(span);
          container.appendChild(li);
        }
        return;
      }
      items.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'profile-growth__item';
        if (typeof item === 'string') {
          const span = document.createElement('span');
          span.textContent = item;
          li.appendChild(span);
        } else {
          if (item.title) {
            const title = document.createElement('strong');
            title.textContent = item.title;
            li.appendChild(title);
          }
          const details = [];
          if (item.timeline) details.push(item.timeline);
          if (item.description) details.push(item.description);
          if (details.length > 0) {
            const span = document.createElement('span');
            span.textContent = details.join(' · ');
            li.appendChild(span);
          }
        }
        container.appendChild(li);
      });
    };

    let currentProfileId = null;

    const resolveProfileId = () => {
      const hashId = getHashId();
      const storedMeta = readStoredMeta();
      if (hashId && (profiles[hashId] || (storedMeta && storedMeta.id === hashId))) {
        return hashId;
      }
      const storedId = getStoredId();
      if (storedId && profiles[storedId]) {
        return storedId;
      }
      return profileIds[0] || null;
    };

    const buildFallbackProfile = (id) => {
      const storedMeta = readStoredMeta();
      const meta = storedMeta && storedMeta.id === id ? storedMeta : null;
      const tags = meta && Array.isArray(meta.tags) ? meta.tags : [];
      return {
        id,
        name: meta && meta.name ? meta.name : 'Profil in Vorbereitung',
        role: meta && meta.role ? meta.role : '—',
        team: meta && meta.team ? meta.team : '—',
        level: 'Noch nicht bewertet',
        focus: tags.length > 0 ? tags[0] : 'Skill Enablement',
        summary: 'Für dieses Profil liegen noch keine Details vor. Bitte Skill-Matrix ergänzen.',
        matrixSubtitle: 'Profil wird aktuell aufgebaut.',
        tags,
        strengths: ['Profil wird vorbereitet – Skill Radar folgt.'],
        growth: [],
        learning: [],
        chips: ['Team Catalyst']
      };
    };

    const renderProfile = (id) => {
      if (!id) return;
      let profile = profiles[id];
      if (!profile) {
        profile = buildFallbackProfile(id);
      } else {
        profile = Object.assign({ id }, profile);
      }

      const storedMeta = readStoredMeta();
      const tags = Array.isArray(profile.tags) && profile.tags.length > 0
        ? profile.tags
        : (storedMeta && storedMeta.id === id && Array.isArray(storedMeta.tags) ? storedMeta.tags : []);
      profile.tags = tags;

      if (!Array.isArray(profile.skills) || profile.skills.length === 0) {
        const sourceTags = tags.length > 0 ? tags : ['Skill Enablement'];
        profile.skills = sourceTags.map((tag, idx) => ({
          name: tag,
          level: idx === 0 ? '4★' : '3★',
          context: (profile.name || 'Teammitglied') + ' setzt ' + tag + ' aktuell in Projekten ein.'
        }));
      }

      fillField('name', profile.name);
      fillField('role', profile.role);
      fillField('team', profile.team);
      fillField('level', profile.level);
      fillField('focus', profile.focus);
      fillField('summary', profile.summary);
      fillField('matrixSubtitle', profile.matrixSubtitle);
      fillField('initials', computeInitials(profile.name));

      renderTags('[data-profile-tags]', profile.tags, 'profile-hero__tag');
      renderTags('[data-profile-chips]', profile.chips || [], 'profile-meta__chip', null);
      renderSkills(profile.skills);
      renderList('[data-profile-strengths]', profile.strengths || [], 'Noch keine Highlights dokumentiert.');
      renderList('[data-profile-growth]', profile.growth || [], 'Kein Entwicklungsplan hinterlegt.');
      renderList('[data-profile-learning]', profile.learning || [], 'Keine Lernpfade geplant.');

      document.title = 'Agile Skill Matrix – ' + profile.name;
      currentProfileId = id;

      storeProfileSelection(id, {
        id,
        name: profile.name,
        role: profile.role,
        team: profile.team,
        tags: profile.tags
      });
    };

    const initialId = resolveProfileId();
    if (initialId) {
      renderProfile(initialId);
      if (getHashId() !== initialId) {
        window.history.replaceState(null, '', '#' + initialId);
      }
    }

    window.addEventListener('hashchange', () => {
      const targetId = getHashId();
      if (!targetId || targetId === currentProfileId) return;
      const storedMeta = readStoredMeta();
      if (profiles[targetId] || (storedMeta && storedMeta.id === targetId)) {
        renderProfile(targetId);
      } else if (profileIds.length > 0) {
        renderProfile(profileIds[0]);
        window.history.replaceState(null, '', '#' + profileIds[0]);
      }
    });
  }

});

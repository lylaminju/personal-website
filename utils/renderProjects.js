import { projects } from '../data/projects.js';

function createProjectBox(project) {
  const projectBox = document.createElement('div');
  projectBox.className = 'project-box';
  projectBox.onclick = () =>
    window.open(project.website || project.github, '_blank');
  const iconPath = '../assets/icons';
  projectBox.innerHTML = `
    <div class="project-image">
      <img src="${project.image || '../assets/default-project.png'}" alt="${
    project.title
  }" width="250" height="200" loading="lazy">
    </div>
    <div class="project-content">
      <div class="title-row">
        <h2>${project.emoji} ${project.title}</h2>
        <ul>
          <li>
            <a target="_blank" href="${project.github}"
              onclick="event.stopPropagation()"
              aria-label="View ${project.title} on GitHub">
              <svg class="link-icon" aria-hidden="true">
                <use href="${iconPath}/github.svg#icon"></use>
              </svg>
            </a>
          </li>
          ${
            project.website
              ? `
                  <li>
                      <a target="_blank" href="${project.website}" onclick="event.stopPropagation()"
                        aria-label="Visit ${project.title} website">
                      <svg class="link-icon" aria-hidden="true">
                          <use href="${iconPath}/web.svg#icon"></use>
                      </svg>
                      </a>
                  </li>
              `
              : ''
          }
          ${
            project.youtube
              ? `
                  <li>
                      <a target="_blank" href="${project.youtube}" onclick="event.stopPropagation()"
                        aria-label="Watch ${project.title} demo on YouTube">
                      <svg class="link-icon" aria-hidden="true">
                          <use href="${iconPath}/youtube.svg#icon"></use>
                      </svg>
                      </a>
                  </li>
              `
              : ''
          }
        </ul>
      </div>
      <p class="explanation">${project.description}</p>
      <p class="tech-stack">⚙️ ${project.techStack}</p>
    </div>
  `;

  return projectBox;
}

function renderProjects() {
  const container = document.getElementById('projects-container');

  projects.forEach((project) => {
    container.appendChild(createProjectBox(project));
  });
}

document.addEventListener('DOMContentLoaded', renderProjects);

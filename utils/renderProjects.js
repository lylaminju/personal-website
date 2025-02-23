import { projects } from '../data/projects.js';

function createProjectBox(project) {
  const projectBox = document.createElement('div');
  projectBox.className = 'project-box';
  projectBox.onclick = () =>
    window.open(project.website || project.github, '_blank');

  projectBox.innerHTML = `
    <div class="project-image">
      <img src="${project.image || '../assets/default-project.png'}" alt="${
    project.title
  }">
    </div>
    <div class="project-content">
      <div class="title-row">
        <h3>${project.emoji} ${project.title}</h3>
        <ul>
          <li>
            <a target="_blank" href="${project.github}"
              onclick="event.stopPropagation()">
              <svg class="link-icon">
                <use href="../assets/github.svg#icon"></use>
              </svg>
            </a>
          </li>
          ${
            project.website
              ? `
                  <li>
                      <a target="_blank" href="${project.website}" onclick="event.stopPropagation()">
                      <svg class="link-icon">
                          <use href="../assets/web.svg#icon"></use>
                      </svg>
                      </a>
                  </li>
              `
              : ''
          }
        </ul>
      </div>
      <p class="explanation">${project.description}</p>
      ${
        project.youtube
          ? `
              <iframe
                  width="560"
                  height="315"
                  src="${project.youtube}"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allowfullscreen
              ></iframe>
          `
          : ''
      }
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

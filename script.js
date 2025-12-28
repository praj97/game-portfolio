function startGame() {
            // Fade out start screen
            document.getElementById('start-screen').classList.add('fade-out');
            
            // Show portfolio screen and start RPG game
            setTimeout(() => {
                document.getElementById('portfolio-screen').classList.add('show');
                initRPG();
                startRotatingGreeting();
            }, 500);
        }

        /**
         * Typewriter Multilingual Greeting System
         * ========================================
         * Types out greetings character by character, then backspaces
         * and types the next greeting
         * 
         * Specifications:
         * - Typing speed: 80ms per character
         * - Backspace speed: 50ms per character
         * - Display duration: 3500ms (after fully typed)
         * - Total cycle time: ~12-15 seconds depending on greeting length
         * - Animation: Type → Pause → Backspace → Type next
         * - Accessibility: Respects prefers-reduced-motion, ARIA live regions
         * 
         * Customization:
         * - Modify greetings array to add/change messages
         * - Adjust typeSpeed/backspaceSpeed for different timing
         * - Adjust displayDuration for longer/shorter display time
         */
        function startRotatingGreeting() {
            // Greeting messages (can be customized)
            const greetings = [
                "HI THERE, I'M PRAJWAL SINGH!",
                "HAJIMEMASHITE (NICE TO MEET YOU)!",
                "HOW ARE YOU TODAY?"
            ];
            
            let currentIndex = 0;
            let currentCharIndex = 0;
            let isTyping = true;
            let isWaiting = false;
            
            const greetingElement = document.getElementById('greeting-text');
            const container = document.getElementById('rotating-greeting');
            
            // Check for reduced motion preference (accessibility)
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const typeSpeed = prefersReducedMotion ? 30 : 80;      // Faster if reduced motion
            const backspaceSpeed = prefersReducedMotion ? 20 : 50; // Faster if reduced motion
            const displayDuration = 3500;
            
            function typeWriter() {
                const currentGreeting = greetings[currentIndex];
                
                if (isWaiting) {
                    // Waiting period after typing is complete
                    return;
                }
                
                if (isTyping) {
                    // Typing phase
                    if (currentCharIndex <= currentGreeting.length) {
                        greetingElement.textContent = currentGreeting.substring(0, currentCharIndex);
                        currentCharIndex++;
                        
                        if (currentCharIndex > currentGreeting.length) {
                            // Finished typing, now wait
                            isWaiting = true;
                            
                            // Update ARIA for screen readers
                            container.setAttribute('aria-label', currentGreeting);
                            
                            setTimeout(() => {
                                isWaiting = false;
                                isTyping = false;
                                typeWriter();
                            }, displayDuration);
                        } else {
                            setTimeout(typeWriter, typeSpeed);
                        }
                    }
                } else {
                    // Backspacing phase
                    if (currentCharIndex > 0) {
                        currentCharIndex--;
                        greetingElement.textContent = currentGreeting.substring(0, currentCharIndex);
                        setTimeout(typeWriter, backspaceSpeed);
                    } else {
                        // Finished backspacing, move to next greeting
                        currentIndex = (currentIndex + 1) % greetings.length;
                        isTyping = true;
                        setTimeout(typeWriter, typeSpeed);
                    }
                }
            }
            
            // Start the typewriter effect
            typeWriter();
        }

        function openModal() {
            document.getElementById('modal-overlay').classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            const modalOverlay = document.getElementById('modal-overlay');
            const projectsContainer = document.getElementById('projects-container');
            const skillsContainer = document.getElementById('skills-container');
            modalOverlay.classList.remove('show');
            
            // Only re-enable scroll if projects and skills sections are not open
            if (!projectsContainer.classList.contains('show') && !skillsContainer.classList.contains('show')) {
                document.body.style.overflow = '';
            }
        }

        // Close modal when clicking outside the box
        document.addEventListener('click', function(e) {
            const modalOverlay = document.getElementById('modal-overlay');
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            const projectsContainer = document.getElementById('projects-container');
            const projectModal = document.getElementById('project-modal');
            const aboutModal = document.getElementById('modal-overlay');
            const skillsContainer = document.getElementById('skills-container');
            
            if (e.key === 'Escape') {
                // Close in order: project detail modal -> about me modal -> projects section -> skills section
                if (projectModal.classList.contains('show')) {
                    closeProjectModal();
                } else if (aboutModal.classList.contains('show')) {
                    closeModal();
                } else if (projectsContainer.classList.contains('show')) {
                    closeProjects();
                } else if (skillsContainer.classList.contains('show')) {
                    closeSkills();
                }
            }
        });

        // Menu button interactions
        document.querySelectorAll('.menu-item').forEach(button => {
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim();
                console.log('Menu item clicked:', buttonText);
                
                // Open modal for About Me
                if (buttonText === 'ABOUT_ME') {
                    openModal();
                }
                
                // Open projects for Projects
                if (buttonText === 'PROJ.ECTS') {
                    openProjects();
                }
                
                // Open skills for Skills
                if (buttonText === 'STATS_ME') {
                    openSkills();
                }
                
                // Visual feedback - use class instead of inline style to avoid hover conflicts
                /*this.classList.add('menu-item-clicked');
                setTimeout(() => {
                    this.classList.remove('menu-item-clicked');
                }, 100);*/
            });
        });

        // ================================================
        // SKILLS SECTION
        // ================================================
        // 
        // This section displays skills with visual proficiency indicators
        // Features:
        // - Animated progress bars that fill from 0% to skill level
        // - Color-coded by proficiency (90-100%: green, 70-89%: blue, <70%: orange)
        // - Responsive grid layout (2 columns desktop, 1 column mobile)
        // - Smooth animations with shimmer effect
        // - Staggered animation for visual appeal
        // 
        // To customize:
        // 1. Edit skillsData array below to add/remove/modify skills
        // 2. Adjust animation timing in animateSkillBars() function
        // 3. Change color thresholds in generateSkills() function
        //
        // Accessibility:
        // - Keyboard navigation (ESC to close)
        // - Focus management
        // - Respects prefers-reduced-motion
        // ================================================

        // Skills Data - Customize with your actual skills
        // Level: 0-100 (percentage of proficiency)
        // 90-100 = Expert (green), 70-89 = Advanced (blue), <70 = Intermediate (orange)
        const skillsData = [
            { name: "JavaScript/TypeScript", level: 90 },
            { name: "React/Next.js", level: 85 },
            { name: "Node.js", level: 80 },
            { name: "Python", level: 75 },
            { name: "UI/UX Design", level: 85 },
            { name: "Git/DevOps", level: 70 },
            { name: "Figma/Adobe XD", level: 88 },
            { name: "HTML/CSS", level: 95 },
            { name: "Generative AI", level: 82 },
            { name: "Prompt Engineering", level: 87 }
        ];

        // Open Skills Section
        function openSkills() {
            const skillsContainer = document.getElementById('skills-container');
            skillsContainer.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Generate skills if not already generated
            if (document.getElementById('skills-grid').children.length === 0) {
                generateSkills();
            }
            
            // Animate progress bars after a short delay
            setTimeout(() => {
                animateSkillBars();
            }, 300);
            
            // Focus on close button for accessibility
            setTimeout(() => {
                document.querySelector('.skills-close').focus();
            }, 100);
        }

        // Close Skills Section
        function closeSkills() {
            const skillsContainer = document.getElementById('skills-container');
            skillsContainer.classList.remove('show');
            document.body.style.overflow = '';
            
            // Reset all progress bars for next open
            document.querySelectorAll('.skill-bar-fill').forEach(bar => {
                bar.style.width = '0%';
            });
        }

        // Generate Skills HTML
        function generateSkills() {
            const skillsGrid = document.getElementById('skills-grid');
            
            skillsData.forEach((skill, index) => {
                // Determine color class based on level
                let colorClass = 'level-intermediate';
                if (skill.level >= 90) {
                    colorClass = 'level-expert';
                } else if (skill.level >= 70) {
                    colorClass = 'level-advanced';
                }
                
                const skillItem = document.createElement('div');
                skillItem.className = 'skill-item';
                skillItem.innerHTML = `
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-level-container">
                        <div class="skill-bar-background">
                            <div class="skill-bar-fill ${colorClass}" data-level="${skill.level}"></div>
                        </div>
                        <div class="skill-percentage">${skill.level}%</div>
                    </div>
                `;
                
                skillsGrid.appendChild(skillItem);
            });
        }

        // Animate Progress Bars
        function animateSkillBars() {
            const bars = document.querySelectorAll('.skill-bar-fill');
            
            bars.forEach((bar, index) => {
                // Staggered animation for each bar
                setTimeout(() => {
                    const level = bar.getAttribute('data-level');
                    bar.style.width = level + '%';
                }, index * 100); // 100ms delay between each bar
            });
        }

        // Projects Data - Add your actual project details here
        // To customize:
        // 1. Replace image URLs with your actual project images
        // 2. Update title, description for each project
        // 3. Add project links in the 'link' field (leave empty to disable link)
        // 4. Add more projects by copying the object structure
        const projectsData = [
            {
                title: "AI PORTFOLIO GENERATOR",
                image: "https://via.placeholder.com/800x600/1a1a2e/00ff00?text=AI+Portfolio+Generator",
                description: "A cutting-edge AI-powered tool that generates personalized portfolios based on user skills and preferences. Leverages machine learning to create unique designs and content recommendations.",
                link: "" // Leave empty for manual population
            },
            {
                title: "UX RESEARCH TOOL",
                image: "https://via.placeholder.com/800x600/1a1a2e/00ff00?text=UX+Research+Tool",
                description: "Comprehensive user research platform that streamlines the process of gathering, analyzing, and presenting user insights. Features automated reporting and data visualization.",
                link: ""
            },
            {
                title: "RETRO GAME UI",
                image: "https://via.placeholder.com/800x600/1a1a2e/00ff00?text=Retro+Game+UI",
                description: "Nostalgic gaming interface that combines modern functionality with classic 8-bit aesthetics. Built with performance optimization and pixel-perfect design principles.",
                link: ""
            },
            {
                title: "GENAI STRATEGIST TOOL",
                image: "https://via.placeholder.com/800x600/1a1a2e/00ff00?text=GenAI+Strategist",
                description: "Strategic planning tool powered by generative AI to help businesses develop comprehensive AI implementation roadmaps. Includes risk assessment and ROI projections.",
                link: ""
            },
            {
                title: "INTERACTIVE DASHBOARD",
                image: "https://via.placeholder.com/800x600/1a1a2e/00ff00?text=Interactive+Dashboard",
                description: "Real-time analytics dashboard with customizable widgets and data visualization. Features responsive design and seamless data integration from multiple sources.",
                link: ""
            },
            {
                title: "ML MODEL INTERFACE",
                image: "https://via.placeholder.com/800x600/1a1a2e/00ff00?text=ML+Model+Interface",
                description: "User-friendly interface for interacting with machine learning models. Simplifies complex ML operations and provides intuitive visualization of model predictions and performance metrics.",
                link: ""
            }
        ];

        // Projects Functions
        function openProjects() {
            const projectsContainer = document.getElementById('projects-container');
            projectsContainer.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent body scroll
            
            // Focus on close button for accessibility
            setTimeout(() => {
                document.querySelector('.projects-close').focus();
            }, 100);
        }

        function closeProjects() {
            const projectsContainer = document.getElementById('projects-container');
            projectsContainer.classList.remove('show');
            document.body.style.overflow = ''; // Re-enable body scroll
        }

        function openProjectModal(projectIndex) {
            const project = projectsData[projectIndex];
            const modal = document.getElementById('project-modal');
            
            // Populate modal with project data
            document.getElementById('modal-project-title').textContent = project.title;
            document.getElementById('modal-project-image').src = project.image;
            document.getElementById('modal-project-image').alt = project.title;
            document.getElementById('modal-project-description').textContent = project.description;
            
            const linkElement = document.getElementById('modal-project-link');
            if (project.link && project.link.trim() !== '') {
                linkElement.href = project.link;
                linkElement.classList.remove('disabled');
            } else {
                linkElement.href = '#';
                linkElement.classList.add('disabled');
            }
            
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus trap - focus on close button
            setTimeout(() => {
                document.querySelector('.project-modal-close').focus();
            }, 100);
        }

        function closeProjectModal() {
            const modal = document.getElementById('project-modal');
            modal.classList.remove('show');
            document.body.style.overflow = 'hidden'; // Keep body scroll disabled (projects still open)
        }

        // Click outside projects modal to close
        document.getElementById('project-modal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeProjectModal();
            }
        });

        // Keyboard accessibility for project cards
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProjectModal(index);
                }
            });
        });

        // Prevent clicks on disabled project links
        document.getElementById('modal-project-link').addEventListener('click', function(e) {
            if (this.classList.contains('disabled')) {
                e.preventDefault();
                console.log('Project link not yet added');
            }
        });

        // Keyboard navigation for menu
        let currentIndex = 0;
        const menuItems = document.querySelectorAll('.menu-item');

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % menuItems.length;
                menuItems[currentIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
                menuItems[currentIndex].focus();
            } else if (e.key === 'Enter') {
                if (document.activeElement.classList.contains('menu-item')) {
                    document.activeElement.click();
                } else if (document.getElementById('start-screen').style.opacity !== '0') {
                    startGame();
                }
            }
        });

        // Top-View Pixelated RPG Background Game
        function initRPG() {
            const canvas = document.getElementById('tetris-bg');
            const ctx = canvas.getContext('2d');
            
            const TILE_SIZE = 40;
            const MAP_WIDTH = 30;
            const MAP_HEIGHT = 22;
            
            canvas.width = MAP_WIDTH * TILE_SIZE;
            canvas.height = MAP_HEIGHT * TILE_SIZE;

            const TILES = {
                GRASS: 0,
                WATER: 1,
                TREE: 2,
                PATH: 3,
                FLOWER: 4,
                ROCK: 5
            };

            let map = [];
            for (let y = 0; y < MAP_HEIGHT; y++) {
                map[y] = [];
                for (let x = 0; x < MAP_WIDTH; x++) {
                    if (x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1) {
                        map[y][x] = TILES.WATER;
                    } else if (Math.abs(x - MAP_WIDTH / 2) < 2 || Math.abs(y - MAP_HEIGHT / 2) < 2) {
                        map[y][x] = TILES.PATH;
                    } else {
                        const rand = Math.random();
                        if (rand < 0.1) {
                            map[y][x] = TILES.TREE;
                        } else if (rand < 0.15) {
                            map[y][x] = TILES.FLOWER;
                        } else if (rand < 0.18) {
                            map[y][x] = TILES.ROCK;
                        } else {
                            map[y][x] = TILES.GRASS;
                        }
                    }
                }
            }

            let player = {
                x: MAP_WIDTH / 2,
                y: MAP_HEIGHT / 2,
                direction: 0,
                animFrame: 0,
                moving: false
            };

            let moveCounter = 0;
            let animCounter = 0;

            function drawTile(x, y, type) {
                const px = x * TILE_SIZE;
                const py = y * TILE_SIZE;

                switch(type) {
                    case TILES.GRASS:
                        ctx.fillStyle = '#7cb342';
                        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                        ctx.fillStyle = '#8bc34a';
                        ctx.fillRect(px + 4, py + 4, 3, 3);
                        ctx.fillRect(px + 20, py + 10, 3, 3);
                        ctx.fillRect(px + 12, py + 22, 3, 3);
                        break;

                    case TILES.WATER:
                        ctx.fillStyle = '#2196f3';
                        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                        ctx.fillStyle = '#42a5f5';
                        ctx.fillRect(px + 8, py + 8, 16, 4);
                        ctx.fillRect(px + 4, py + 20, 16, 4);
                        break;

                    case TILES.TREE:
                        ctx.fillStyle = '#7cb342';
                        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                        ctx.fillStyle = '#5d4037';
                        ctx.fillRect(px + 12, py + 18, 8, 10);
                        ctx.fillStyle = '#2e7d32';
                        ctx.fillRect(px + 8, py + 8, 16, 12);
                        ctx.fillStyle = '#388e3c';
                        ctx.fillRect(px + 10, py + 10, 12, 8);
                        break;

                    case TILES.PATH:
                        ctx.fillStyle = '#a1887f';
                        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                        ctx.fillStyle = '#8d6e63';
                        ctx.fillRect(px + 8, py + 8, 4, 4);
                        ctx.fillRect(px + 20, py + 16, 4, 4);
                        ctx.fillRect(px + 12, py + 24, 4, 4);
                        break;

                    case TILES.FLOWER:
                        ctx.fillStyle = '#7cb342';
                        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                        ctx.fillStyle = '#ff4081';
                        ctx.fillRect(px + 10, py + 12, 4, 4);
                        ctx.fillStyle = '#ffeb3b';
                        ctx.fillRect(px + 20, py + 18, 4, 4);
                        break;

                    case TILES.ROCK:
                        ctx.fillStyle = '#7cb342';
                        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                        ctx.fillStyle = '#616161';
                        ctx.fillRect(px + 8, py + 12, 16, 12);
                        ctx.fillStyle = '#757575';
                        ctx.fillRect(px + 10, py + 14, 12, 8);
                        break;
                }
            }

            function drawPlayer() {
                const px = player.x * TILE_SIZE;
                const py = player.y * TILE_SIZE;

                ctx.fillStyle = '#00ff00';
                ctx.fillRect(px + 10, py + 14, 12, 10);

                ctx.fillStyle = '#ffdbac';
                ctx.fillRect(px + 12, py + 8, 8, 8);

                ctx.fillStyle = '#000';
                if (player.direction === 0) {
                    ctx.fillRect(px + 13, py + 12, 2, 2);
                    ctx.fillRect(px + 17, py + 12, 2, 2);
                } else if (player.direction === 2) {
                    ctx.fillRect(px + 13, py + 10, 2, 2);
                    ctx.fillRect(px + 17, py + 10, 2, 2);
                } else if (player.direction === 1) {
                    ctx.fillRect(px + 13, py + 11, 2, 2);
                } else {
                    ctx.fillRect(px + 17, py + 11, 2, 2);
                }

                ctx.fillStyle = '#0066cc';
                if (player.moving && player.animFrame % 2 === 0) {
                    ctx.fillRect(px + 10, py + 24, 4, 4);
                    ctx.fillRect(px + 18, py + 24, 4, 4);
                } else {
                    ctx.fillRect(px + 12, py + 24, 4, 4);
                    ctx.fillRect(px + 16, py + 24, 4, 4);
                }

                ctx.fillStyle = '#ffd700';
                if (player.direction === 3) {
                    ctx.fillRect(px + 22, py + 16, 3, 8);
                } else {
                    ctx.fillRect(px + 7, py + 16, 3, 8);
                }
            }

            function canMove(x, y) {
                if (x < 1 || x >= MAP_WIDTH - 1 || y < 1 || y >= MAP_HEIGHT - 1) {
                    return false;
                }
                const tile = map[Math.floor(y)][Math.floor(x)];
                return tile !== TILES.WATER && tile !== TILES.TREE && tile !== TILES.ROCK;
            }

            function autoMove() {
                moveCounter++;
                animCounter++;

                if (animCounter > 10) {
                    player.animFrame++;
                    animCounter = 0;
                }

                if (moveCounter > 30) {
                    player.moving = true;
                    
                    const directions = [
                        {dx: 0, dy: 1, dir: 0},
                        {dx: -1, dy: 0, dir: 1},
                        {dx: 0, dy: -1, dir: 2},
                        {dx: 1, dy: 0, dir: 3}
                    ];

                    let move = directions[player.direction];
                    let newX = player.x + move.dx * 0.5;
                    let newY = player.y + move.dy * 0.5;

                    if (!canMove(newX, newY)) {
                        player.direction = Math.floor(Math.random() * 4);
                        move = directions[player.direction];
                        newX = player.x + move.dx * 0.5;
                        newY = player.y + move.dy * 0.5;
                    }

                    if (canMove(newX, newY)) {
                        player.x = newX;
                        player.y = newY;
                    }

                    if (Math.random() < 0.1) {
                        player.direction = Math.floor(Math.random() * 4);
                    }

                    moveCounter = 0;
                    player.moving = false;
                }
            }

            function render() {
                for (let y = 0; y < MAP_HEIGHT; y++) {
                    for (let x = 0; x < MAP_WIDTH; x++) {
                        drawTile(x, y, map[y][x]);
                    }
                }
                drawPlayer();
            }

            function gameLoop() {
                autoMove();
                render();
                requestAnimationFrame(gameLoop);
            }

            gameLoop();
        }
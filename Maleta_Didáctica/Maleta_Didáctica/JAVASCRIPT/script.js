// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Navegación entre páginas
    const pages = {
        login: document.getElementById('login-page'),
        areas: document.getElementById('areas-page')
    };

    // Mapeo de actividades a archivos
    const activityFiles = {
        'lectura': {
            'dislexia': 'lectura/dislexia.html',
            'dislalia': 'lectura/dislalia.html'
        },
        'escritura': {
            'disgrafia': 'escritura/disgrafia.html',
            'disortografia': 'escritura/disortografia.html'
        },
        'calculo': {
            'ejercicios': 'calculo/ejercicios.html'
        }
    };

    // Variables para control de expansión
    let expandedSquare = null;
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Login con grado
    document.querySelectorAll('.grade-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const grade = this.getAttribute('data-grade');
            localStorage.setItem('userGrade', grade);
            showPage('areas');
        });
    });

    // Clic en los cuadrados de áreas
    document.querySelectorAll('.area-square').forEach(square => {
        square.addEventListener('click', function(e) {
            // Si ya está expandido, no hacer nada (las actividades manejan su propio clic)
            if (this.classList.contains('expanded')) {
                return;
            }
            
            // Colapsar cuadrado previamente expandido
            if (expandedSquare && expandedSquare !== this) {
                collapseSquare(expandedSquare);
            }
            
            // Expandir este cuadrado
            expandSquare(this);
        });
    });

    // Clic en actividades específicas
    document.querySelectorAll('.activity-item').forEach(activity => {
        activity.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevenir que el clic llegue al cuadrado padre
            
            const area = this.closest('.area-square').getAttribute('data-area');
            const activityName = this.getAttribute('data-activity');
            
            // Navegar a la actividad
            navigateToActivity(area, activityName);
        });
    });

    // Clic en el overlay para colapsar
    overlay.addEventListener('click', function() {
        if (expandedSquare) {
            collapseSquare(expandedSquare);
        }
    });

    // Botones de navegación
    document.getElementById('back-to-login').addEventListener('click', () => showPage('login'));

    function showPage(pageName) {
        // Ocultar todas las páginas
        Object.values(pages).forEach(page => {
            page.classList.remove('active');
        });
        
        // Mostrar página seleccionada
        pages[pageName].classList.add('active');
        
        // Colapsar cualquier cuadrado expandido al cambiar de página
        if (expandedSquare) {
            collapseSquare(expandedSquare);
        }
    }

    function expandSquare(square) {
        expandedSquare = square;
        square.classList.add('expanded');
        overlay.style.display = 'block';
        
        // Ajustar el z-index de todos los cuadrados
        document.querySelectorAll('.area-square').forEach(sq => {
            if (sq !== square) {
                sq.style.zIndex = '1';
            } else {
                sq.style.zIndex = '10';
            }
        });
    }

    function collapseSquare(square) {
        square.classList.remove('expanded');
        overlay.style.display = 'none';
        expandedSquare = null;
        
        // Resetear z-index
        document.querySelectorAll('.area-square').forEach(sq => {
            sq.style.zIndex = '';
        });
    }

    function navigateToActivity(area, activity) {
        const filePath = activityFiles[area]?.[activity];
        if (filePath) {
            window.location.href = filePath;
        } else {
            console.error('Archivo de actividad no encontrado:', area, activity);
            alert('Actividad no disponible en este momento.');
        }
    }

    // Cerrar cuadrado expandido con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && expandedSquare) {
            collapseSquare(expandedSquare);
        }
    });
});
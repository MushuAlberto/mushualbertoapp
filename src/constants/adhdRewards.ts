
export const ADHD_REWARDS = [
  // Flexibilidad y descansos (1-20)
  {
    id: 'skip-habit-day',
    name: 'Día libre de hábito',
    description: 'Puedes saltarte cualquier hábito por hoy sin perder tu racha',
    cost: 50,
    category: 'flexibility',
    icon: '🎯'
  },
  {
    id: 'extend-deadline',
    name: 'Extensión de plazo',
    description: 'Extiende la fecha límite de una tarea por 2 días',
    cost: 30,
    category: 'flexibility',
    icon: '⏰'
  },
  {
    id: 'break-15min',
    name: 'Descanso de 15 minutos',
    description: 'Tómate un descanso guilt-free de 15 minutos',
    cost: 20,
    category: 'break',
    icon: '☕'
  },
  {
    id: 'break-30min',
    name: 'Descanso de 30 minutos',
    description: 'Disfruta de 30 minutos de tiempo libre sin culpa',
    cost: 35,
    category: 'break',
    icon: '🛋️'
  },
  {
    id: 'break-1hour',
    name: 'Hora de descanso',
    description: 'Una hora completa para hacer lo que quieras',
    cost: 60,
    category: 'break',
    icon: '🌟'
  },
  {
    id: 'nap-permission',
    name: 'Permiso para siesta',
    description: '20 minutos de siesta reparadora sin culpa',
    cost: 40,
    category: 'break',
    icon: '😴'
  },
  {
    id: 'postpone-task',
    name: 'Posponer tarea',
    description: 'Mueve una tarea al día siguiente sin penalización',
    cost: 25,
    category: 'flexibility',
    icon: '📅'
  },
  {
    id: 'reduce-task',
    name: 'Reducir tarea',
    description: 'Reduce el alcance de una tarea grande a la mitad',
    cost: 45,
    category: 'flexibility',
    icon: '✂️'
  },
  {
    id: 'change-environment',
    name: 'Cambio de ambiente',
    description: 'Permiso para trabajar en un lugar diferente',
    cost: 15,
    category: 'environment',
    icon: '🏞️'
  },
  {
    id: 'fidget-time',
    name: 'Tiempo para fidgeting',
    description: '10 minutos para mover, estirar o fidgetear',
    cost: 10,
    category: 'movement',
    icon: '🤸'
  },
  {
    id: 'walk-break',
    name: 'Paseo energizante',
    description: 'Sal a caminar 15 minutos para recargar energías',
    cost: 25,
    category: 'movement',
    icon: '🚶'
  },
  {
    id: 'music-session',
    name: 'Sesión de música',
    description: '20 minutos de tu música favorita mientras trabajas',
    cost: 20,
    category: 'stimulation',
    icon: '🎵'
  },
  {
    id: 'stretch-session',
    name: 'Sesión de estiramientos',
    description: '10 minutos de estiramientos para resetear',
    cost: 15,
    category: 'movement',
    icon: '🧘'
  },
  {
    id: 'breathing-space',
    name: 'Espacio para respirar',
    description: '5 minutos de respiración consciente',
    cost: 10,
    category: 'mindfulness',
    icon: '🫁'
  },
  {
    id: 'outdoor-time',
    name: 'Tiempo al aire libre',
    description: '15 minutos en exteriores para resetear',
    cost: 30,
    category: 'environment',
    icon: '🌳'
  },
  {
    id: 'creative-break',
    name: 'Pausa creativa',
    description: '20 minutos de actividad creativa libre',
    cost: 35,
    category: 'creativity',
    icon: '🎨'
  },
  {
    id: 'social-break',
    name: 'Descanso social',
    description: '15 minutos para hablar con alguien que te haga bien',
    cost: 25,
    category: 'social',
    icon: '💬'
  },
  {
    id: 'solo-time',
    name: 'Tiempo a solas',
    description: '30 minutos de solitud para recargar',
    cost: 30,
    category: 'recharge',
    icon: '🤫'
  },
  {
    id: 'stimming-permission',
    name: 'Permiso para stimming',
    description: 'Tiempo libre para movimientos autorregulatorios',
    cost: 15,
    category: 'regulation',
    icon: '🌀'
  },
  {
    id: 'reset-day',
    name: 'Día de reset',
    description: 'Reinicia tu día sin presión por lo no hecho',
    cost: 80,
    category: 'flexibility',
    icon: '🔄'
  },

  // Herramientas y apoyo (21-40)
  {
    id: 'pomodoro-extension',
    name: 'Pomodoro extendido',
    description: 'Alarga tu próximo pomodoro a 35 minutos',
    cost: 20,
    category: 'tools',
    icon: '🍅'
  },
  {
    id: 'pomodoro-short',
    name: 'Pomodoro corto',
    description: 'Reduce tu próximo pomodoro a 15 minutos',
    cost: 15,
    category: 'tools',
    icon: '⏱️'
  },
  {
    id: 'focus-music',
    name: 'Playlist de concentración',
    description: 'Acceso a música especializada para TDAH',
    cost: 25,
    category: 'tools',
    icon: '🎧'
  },
  {
    id: 'noise-canceling',
    name: 'Modo silencio',
    description: 'Bloquea notificaciones por 1 hora',
    cost: 30,
    category: 'environment',
    icon: '🔇'
  },
  {
    id: 'task-breakdown',
    name: 'Ayuda para desglosar',
    description: 'Asistencia para dividir una tarea grande',
    cost: 40,
    category: 'support',
    icon: '🧩'
  },
  {
    id: 'priority-helper',
    name: 'Asistente de prioridades',
    description: 'Ayuda para ordenar tus tareas por importancia',
    cost: 35,
    category: 'support',
    icon: '📊'
  },
  {
    id: 'reminder-boost',
    name: 'Recordatorios extra',
    description: 'Recordatorios adicionales para una tarea importante',
    cost: 20,
    category: 'support',
    icon: '🔔'
  },
  {
    id: 'accountability-buddy',
    name: 'Compañero virtual',
    description: 'Check-ins extra con Mushu durante el día',
    cost: 45,
    category: 'support',
    icon: '👥'
  },
  {
    id: 'dopamine-hit',
    name: 'Impulso de dopamina',
    description: 'Mini celebración por cada pequeño logro',
    cost: 15,
    category: 'motivation',
    icon: '🎉'
  },
  {
    id: 'energy-check',
    name: 'Monitoreo de energía',
    description: 'Seguimiento personalizado de niveles de energía',
    cost: 30,
    category: 'awareness',
    icon: '⚡'
  },
  {
    id: 'mood-tracking',
    name: 'Seguimiento del estado',
    description: 'Registro detallado de cómo te sientes',
    cost: 25,
    category: 'awareness',
    icon: '📈'
  },
  {
    id: 'transition-time',
    name: 'Tiempo de transición',
    description: '10 minutos extra entre tareas para cambiar de chip',
    cost: 20,
    category: 'transition',
    icon: '🔀'
  },
  {
    id: 'hyperfocus-guard',
    name: 'Guardián del hiperfoco',
    description: 'Alertas cada 2 horas para comer/hidratarse',
    cost: 40,
    category: 'health',
    icon: '⚠️'
  },
  {
    id: 'executive-boost',
    name: 'Impulso ejecutivo',
    description: 'Estructura extra para una tarea compleja',
    cost: 50,
    category: 'support',
    icon: '🧠'
  },
  {
    id: 'sensory-break',
    name: 'Pausa sensorial',
    description: 'Tiempo para ajustar tu entorno sensorial',
    cost: 25,
    category: 'regulation',
    icon: '👂'
  },
  {
    id: 'overwhelm-rescue',
    name: 'Rescate del agobio',
    description: 'Protocolo de emergencia cuando te sientes abrumado',
    cost: 60,
    category: 'emergency',
    icon: '🆘'
  },
  {
    id: 'dopamine-menu',
    name: 'Menú de dopamina',
    description: 'Lista personalizada de actividades que te motivan',
    cost: 35,
    category: 'motivation',
    icon: '📋'
  },
  {
    id: 'body-doubling',
    name: 'Acompañamiento virtual',
    description: 'Sesión de trabajo acompañado por Mushu',
    cost: 45,
    category: 'support',
    icon: '👻'
  },
  {
    id: 'time-blocking',
    name: 'Bloqueo de tiempo',
    description: 'Ayuda para estructurar tu día en bloques',
    cost: 40,
    category: 'planning',
    icon: '🗓️'
  },
  {
    id: 'interest-based-task',
    name: 'Tarea basada en interés',
    description: 'Conecta una tarea aburrida con tus intereses',
    cost: 35,
    category: 'motivation',
    icon: '🎯'
  },

  // Autocuidado y bienestar (41-60)
  {
    id: 'hydration-reminder',
    name: 'Recordatorio de hidratación',
    description: 'Alertas personalizadas para beber agua',
    cost: 15,
    category: 'health',
    icon: '💧'
  },
  {
    id: 'meal-reminder',
    name: 'Recordatorio de comida',
    description: 'No olvides alimentarte durante el hiperfoco',
    cost: 20,
    category: 'health',
    icon: '🍎'
  },
  {
    id: 'sleep-prep',
    name: 'Preparación para dormir',
    description: 'Rutina guiada para una mejor calidad de sueño',
    cost: 40,
    category: 'health',
    icon: '🛏️'
  },
  {
    id: 'medication-reminder',
    name: 'Recordatorio de medicación',
    description: 'Alertas discretas para tomar medicamentos',
    cost: 25,
    category: 'health',
    icon: '💊'
  },
  {
    id: 'emotional-check',
    name: 'Check emocional',
    description: 'Pausa para identificar y validar tus emociones',
    cost: 30,
    category: 'emotional',
    icon: '❤️'
  },
  {
    id: 'rejection-sensitivity-care',
    name: 'Cuidado RSD',
    description: 'Protocolo especial para sensibilidad al rechazo',
    cost: 50,
    category: 'emotional',
    icon: '🛡️'
  },
  {
    id: 'self-compassion',
    name: 'Autocompasión',
    description: 'Recordatorio gentil de tratarte con amabilidad',
    cost: 20,
    category: 'emotional',
    icon: '🤗'
  },
  {
    id: 'perfectionism-brake',
    name: 'Freno al perfeccionismo',
    description: 'Permiso para hacer algo "suficientemente bien"',
    cost: 35,
    category: 'mindset',
    icon: '✅'
  },
  {
    id: 'celebration-moment',
    name: 'Momento de celebración',
    description: 'Pausa para reconocer tus logros, por pequeños que sean',
    cost: 25,
    category: 'motivation',
    icon: '🏆'
  },
  {
    id: 'gentle-redirect',
    name: 'Redirección gentil',
    description: 'Volver al foco sin auto-crítica',
    cost: 20,
    category: 'regulation',
    icon: '🧭'
  },
  {
    id: 'texture-comfort',
    name: 'Confort textural',
    description: 'Tiempo con tu textura o objeto favorito',
    cost: 15,
    category: 'sensory',
    icon: '🧸'
  },
  {
    id: 'light-adjustment',
    name: 'Ajuste de iluminación',
    description: 'Recordatorio para optimizar la luz de tu espacio',
    cost: 10,
    category: 'environment',
    icon: '💡'
  },
  {
    id: 'temperature-check',
    name: 'Control de temperatura',
    description: 'Pausa para ajustar la temperatura ambiente',
    cost: 10,
    category: 'environment',
    icon: '🌡️'
  },
  {
    id: 'organization-burst',
    name: 'Ráfaga de organización',
    description: '5 minutos de ordenar tu espacio de trabajo',
    cost: 20,
    category: 'environment',
    icon: '🗂️'
  },
  {
    id: 'comfort-position',
    name: 'Posición cómoda',
    description: 'Permiso para trabajar en tu posición más cómoda',
    cost: 15,
    category: 'comfort',
    icon: '🪑'
  },
  {
    id: 'brain-fog-help',
    name: 'Ayuda con niebla mental',
    description: 'Estrategias para cuando tu mente está nublada',
    cost: 40,
    category: 'cognitive',
    icon: '🌫️'
  },
  {
    id: 'memory-aid',
    name: 'Ayuda de memoria',
    description: 'Herramientas extra para recordar información',
    cost: 30,
    category: 'cognitive',
    icon: '🧠'
  },
  {
    id: 'decision-fatigue-relief',
    name: 'Alivio de fatiga decisional',
    description: 'Simplifica las decisiones del día',
    cost: 45,
    category: 'cognitive',
    icon: '🤔'
  },
  {
    id: 'routine-flexibility',
    name: 'Flexibilidad de rutina',
    description: 'Adapta tu rutina a cómo te sientes hoy',
    cost: 35,
    category: 'flexibility',
    icon: '🔄'
  },
  {
    id: 'energy-matching',
    name: 'Coincidencia de energía',
    description: 'Empareja tareas con tu nivel de energía actual',
    cost: 30,
    category: 'planning',
    icon: '🔋'
  },

  // Motivación y progreso (61-80)
  {
    id: 'progress-visualization',
    name: 'Visualización de progreso',
    description: 'Gráfico visual de todo lo que has logrado',
    cost: 30,
    category: 'motivation',
    icon: '📊'
  },
  {
    id: 'future-self-message',
    name: 'Mensaje del yo futuro',
    description: 'Recordatorio de por qué esto importa a largo plazo',
    cost: 25,
    category: 'motivation',
    icon: '✉️'
  },
  {
    id: 'strength-reminder',
    name: 'Recordatorio de fortalezas',
    description: 'Lista de tus superpoderes TDAH únicos',
    cost: 30,
    category: 'motivation',
    icon: '💪'
  },
  {
    id: 'micro-achievement',
    name: 'Micro-logro',
    description: 'Celebra completar cualquier tarea pequeña',
    cost: 10,
    category: 'motivation',
    icon: '⭐'
  },
  {
    id: 'curiosity-boost',
    name: 'Impulso de curiosidad',
    description: 'Encuentra el aspecto más interesante de tu tarea',
    cost: 25,
    category: 'motivation',
    icon: '🔍'
  },
  {
    id: 'novelty-injection',
    name: 'Inyección de novedad',
    description: 'Haz familiar tarea de una manera completamente nueva',
    cost: 35,
    category: 'motivation',
    icon: '🎪'
  },
  {
    id: 'gamification-boost',
    name: 'Impulso de gamificación',
    description: 'Convierte tu tarea en un juego divertido',
    cost: 40,
    category: 'motivation',
    icon: '🎮'
  },
  {
    id: 'competition-mode',
    name: 'Modo competición',
    description: 'Compite contigo mismo de ayer',
    cost: 30,
    category: 'motivation',
    icon: '🏁'
  },
  {
    id: 'collaboration-invite',
    name: 'Invitación a colaborar',
    description: 'Encuentra a alguien para hacer la tarea juntos',
    cost: 45,
    category: 'social',
    icon: '🤝'
  },
  {
    id: 'teaching-opportunity',
    name: 'Oportunidad de enseñar',
    description: 'Explica lo que aprendiste a alguien más',
    cost: 35,
    category: 'social',
    icon: '👨‍🏫'
  },
  {
    id: 'passion-connection',
    name: 'Conexión con pasión',
    description: 'Vincula la tarea con algo que te apasiona',
    cost: 40,
    category: 'motivation',
    icon: '🔥'
  },
  {
    id: 'impact-reminder',
    name: 'Recordatorio de impacto',
    description: 'Cómo esta tarea ayuda a otros o te ayuda a ti',
    cost: 30,
    category: 'motivation',
    icon: '🌍'
  },
  {
    id: 'learning-highlight',
    name: 'Destacar aprendizaje',
    description: 'Enfócate en qué vas a aprender, no en el resultado',
    cost: 25,
    category: 'mindset',
    icon: '📚'
  },
  {
    id: 'experiment-mindset',
    name: 'Mentalidad experimental',
    description: 'Ve la tarea como un experimento, no como éxito/fracaso',
    cost: 35,
    category: 'mindset',
    icon: '🧪'
  },
  {
    id: 'play-permission',
    name: 'Permiso para jugar',
    description: 'Aborda la tarea con espíritu juguetón',
    cost: 30,
    category: 'mindset',
    icon: '🎈'
  },
  {
    id: 'creative-approach',
    name: 'Enfoque creativo',
    description: 'Encuentra la manera más creativa de hacer esto',
    cost: 35,
    category: 'creativity',
    icon: '🎭'
  },
  {
    id: 'story-creation',
    name: 'Creación de historia',
    description: 'Convierte tu día en una aventura épica',
    cost: 40,
    category: 'creativity',
    icon: '📖'
  },
  {
    id: 'visual-thinking',
    name: 'Pensamiento visual',
    description: 'Usa mapas mentales, dibujos o diagramas',
    cost: 30,
    category: 'cognitive',
    icon: '🎨'
  },
  {
    id: 'movement-integration',
    name: 'Integración de movimiento',
    description: 'Haz la tarea mientras te mueves',
    cost: 25,
    category: 'movement',
    icon: '🚶‍♀️'
  },
  {
    id: 'reward-preview',
    name: 'Vista previa de recompensa',
    description: 'Imagina vívidamente cómo te sentirás al terminar',
    cost: 20,
    category: 'motivation',
    icon: '🎁'
  },

  // Herramientas avanzadas y emergencias (81-100)
  {
    id: 'executive-function-bypass',
    name: 'Bypass de función ejecutiva',
    description: 'Sistema automático para cuando no puedes decidir',
    cost: 70,
    category: 'emergency',
    icon: '🤖'
  },
  {
    id: 'shutdown-protocol',
    name: 'Protocolo de apagado',
    description: 'Plan completo para cuando estás sobrecargado',
    cost: 80,
    category: 'emergency',
    icon: '🔴'
  },
  {
    id: 'meltdown-recovery',
    name: 'Recuperación post-colapso',
    description: 'Cuidado gentil después de un momento difícil',
    cost: 60,
    category: 'recovery',
    icon: '🌈'
  },
  {
    id: 'rejection-sensitivity-shield',
    name: 'Escudo RSD',
    description: 'Protección extra contra la sensibilidad al rechazo',
    cost: 75,
    category: 'emotional',
    icon: '🛡️'
  },
  {
    id: 'hyperfocus-harness',
    name: 'Aprovechar hiperfoco',
    description: 'Canaliza tu hiperfoco hacia lo más importante',
    cost: 85,
    category: 'cognitive',
    icon: '🎯'
  },
  {
    id: 'dopamine-drought-rescue',
    name: 'Rescate de sequía de dopamina',
    description: 'Plan de emergencia para días sin motivación',
    cost: 90,
    category: 'emergency',
    icon: '🚰'
  },
  {
    id: 'time-blindness-aid',
    name: 'Ayuda para ceguera temporal',
    description: 'Sistema mejorado de percepción del tiempo',
    cost: 65,
    category: 'cognitive',
    icon: '⏰'
  },
  {
    id: 'context-switching-help',
    name: 'Ayuda para cambio de contexto',
    description: 'Transiciones suaves entre diferentes tipos de tareas',
    cost: 55,
    category: 'cognitive',
    icon: '🔄'
  },
  {
    id: 'working-memory-boost',
    name: 'Impulso de memoria de trabajo',
    description: 'Herramientas para mantener información en mente',
    cost: 50,
    category: 'cognitive',
    icon: '🧠'
  },
  {
    id: 'emotional-dysregulation-calm',
    name: 'Calma para disregulación',
    description: 'Técnicas para estabilizar emociones intensas',
    cost: 70,
    category: 'emotional',
    icon: '🧘‍♀️'
  },
  {
    id: 'procrastination-breaker',
    name: 'Rompe procrastinación',
    description: 'Sistema para superar el bloqueo de inicio',
    cost: 60,
    category: 'cognitive',
    icon: '⚡'
  },
  {
    id: 'perfectionism-antidote',
    name: 'Antídoto al perfeccionismo',
    description: 'Liberación del bucle de perfeccionismo paralizante',
    cost: 65,
    category: 'mindset',
    icon: '💊'
  },
  {
    id: 'analysis-paralysis-cure',
    name: 'Cura parálisis por análisis',
    description: 'Toma decisiones cuando pensar demasiado te bloquea',
    cost: 55,
    category: 'cognitive',
    icon: '🔓'
  },
  {
    id: 'sensory-overload-retreat',
    name: 'Refugio sobrecarga sensorial',
    description: 'Espacio seguro cuando el mundo es demasiado',
    cost: 75,
    category: 'sensory',
    icon: '🏠'
  },
  {
    id: 'masking-fatigue-relief',
    name: 'Alivio fatiga por mascarilla',
    description: 'Descanso de actuar neurotípico',
    cost: 80,
    category: 'recovery',
    icon: '😌'
  },
  {
    id: 'impostor-syndrome-fighter',
    name: 'Luchador síndrome impostor',
    description: 'Recordatorios de tu competencia real',
    cost: 70,
    category: 'emotional',
    icon: '👑'
  },
  {
    id: 'burnout-prevention',
    name: 'Prevención de burnout',
    description: 'Sistema de alerta temprana y prevención',
    cost: 85,
    category: 'health',
    icon: '🚨'
  },
  {
    id: 'executive-function-scaffold',
    name: 'Andamiaje función ejecutiva',
    description: 'Estructura externa para planificación y organización',
    cost: 90,
    category: 'support',
    icon: '🏗️'
  },
  {
    id: 'co-regulation-session',
    name: 'Sesión de co-regulación',
    description: 'Acompañamiento para regular tu sistema nervioso',
    cost: 85,
    category: 'regulation',
    icon: '🤝'
  },
  {
    id: 'adhd-pride-boost',
    name: 'Impulso orgullo TDAH',
    description: 'Celebración de tus diferencias neurodivergentes',
    cost: 50,
    category: 'identity',
    icon: '🌈'
  }
];

export const ADHD_REWARD_CATEGORIES = {
  flexibility: 'Flexibilidad',
  break: 'Descansos',
  movement: 'Movimiento',
  environment: 'Ambiente',
  stimulation: 'Estimulación',
  mindfulness: 'Atención plena',
  creativity: 'Creatividad',
  social: 'Social',
  recharge: 'Recarga',
  regulation: 'Autorregulación',
  tools: 'Herramientas',
  support: 'Apoyo',
  motivation: 'Motivación',
  awareness: 'Conciencia',
  transition: 'Transición',
  health: 'Salud',
  emergency: 'Emergencia',
  planning: 'Planificación',
  emotional: 'Emocional',
  mindset: 'Mentalidad',
  sensory: 'Sensorial',
  comfort: 'Confort',
  cognitive: 'Cognitivo',
  recovery: 'Recuperación',
  identity: 'Identidad'
};

export const ELocale = {
  PT_BR: 'pt-BR',
  EN_US: 'en-US',
} as const;

export type TLocale = keyof typeof ELocale;

const translations = {
  [ELocale.PT_BR]: {
    'room.screen.titlePrefix': 'Sala',
    'room.screen.subtitle': 'Sincronização em tempo real',
    'room.screen.authRequired': 'Faça login para entrar na sala',
    'room.screen.loading': 'Carregando...',
    'room.screen.error': 'Erro ao carregar sala',
    'room.header.host': 'Host',
    'room.header.participant': 'Participante',
    'room.controls.seekBack': '⏪ 10s',
    'room.controls.seekForward': '10s ⏩',
    'room.controls.play': 'Reproduzir',
    'room.controls.pause': 'Pausar',
    'room.participants.title': 'Participantes',
    'room.videoInput.placeholder': 'YouTube ID',
    'room.videoInput.button': 'Atualizar',
    'content.premiumLabel': 'Premium',
    'home.premiumContent': 'Conteúdo Premium',
    'home.popularRooms': 'Salas Populares',
    'home.viewAll': 'Ver todas →',
    'createRoom.title': 'Criar Sala',
    'createRoom.subtitle': 'Defina um vídeo do YouTube para sincronizar',
    'createRoom.create': 'Criar Sala',
    'createRoom.authRequired': 'Faça login para criar sala',
    'createRoom.loading': 'Criando...',
    'createRoom.error': 'Erro ao criar sala',
    'errors.invalidUser': 'Usuário inválido',
    'errors.invalidVideo': 'Video inválido',
    'errors.joinFailed': 'Erro ao entrar na sala',
    'errors.createFailed': 'Erro ao criar sala'
  },
  [ELocale.EN_US]: {
    'room.screen.titlePrefix': 'Room',
    'room.screen.subtitle': 'Real-time sync',
    'room.screen.authRequired': 'Sign in to join the room',
    'room.screen.loading': 'Loading...',
    'room.screen.error': 'Failed to load room',
    'room.header.host': 'Host',
    'room.header.participant': 'Participant',
    'room.controls.seekBack': '⏪ 10s',
    'room.controls.seekForward': '10s ⏩',
    'room.controls.play': 'Play',
    'room.controls.pause': 'Pause',
    'room.participants.title': 'Participants',
    'room.videoInput.placeholder': 'YouTube ID',
    'room.videoInput.button': 'Update',
    'content.premiumLabel': 'Premium',
    'home.premiumContent': 'Premium Content',
    'home.popularRooms': 'Popular Rooms',
    'home.viewAll': 'View all →',
    'createRoom.title': 'Create Room',
    'createRoom.subtitle': 'Set a YouTube video to sync',
    'createRoom.create': 'Create Room',
    'createRoom.authRequired': 'Sign in to create a room',
    'createRoom.loading': 'Creating...',
    'createRoom.error': 'Failed to create room',
    'errors.invalidUser': 'Invalid user',
    'errors.invalidVideo': 'Invalid video',
    'errors.joinFailed': 'Failed to join room',
    'errors.createFailed': 'Failed to create room'
  }
} as const;

export type TTranslationKey = keyof typeof translations[typeof ELocale.PT_BR];

let currentLocale: TLocale = 'PT_BR';

export const setLocale = (locale: TLocale) => {
  currentLocale = locale;
};

export const getLocale = (): TLocale => currentLocale;

const replaceParams = (value: string, params?: Record<string, string | number>) => {
  if (!params) return value;
  return Object.keys(params).reduce((acc, key) => {
    return acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(params[key]));
  }, value);
};

export const translateWithLocale = (
  locale: TLocale,
  key: TTranslationKey,
  params?: Record<string, string | number>
) => {
  const fallback = translations[ELocale.PT_BR][key];
  const value = translations[ELocale[locale]][key] ?? fallback;
  return replaceParams(value, params);
};

export const t = (key: TTranslationKey, params?: Record<string, string | number>) => {
  return translateWithLocale(currentLocale, key, params);
};

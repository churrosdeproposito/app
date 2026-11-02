/* CONFIGURAÇÃO DESTE RESTAURANTE — único arquivo que muda de um restaurante para outro (gerado pelo Painel de Revenda). Só endereços e chaves PÚBLICAS. */
window.RESTAURANTE = {
  motor: 'https://lucassricardo95.github.io/motor/estavel/',
  slug: 'churros-de-proposito',
  nome: 'Churros de Propósito',
  siteUrl: 'https://churrosdeproposito.github.io/app/',
  supabaseUrl: 'https://ljipjjzjjnzedcuksmon.supabase.co',
  supabaseChave: 'sb_publishable_yQnxdp8yt7lWOF02HfJoAw__Gj2ooiQ',
  apiUrl: 'https://script.google.com/macros/s/AKfycbzffclUmW5OSFb6VNlWAcgCe-7kcYZewYlVfMNpSaWI4mvaQv8F3pHfOJwH77SLgyYHJg/exec',
  contingenciaUrl: 'https://script.google.com/macros/s/AKfycbx8kLJ2U-UMDinpcDCJt_iaORcA9IH3dSw3JQf418zlcQ8ti1H85w2fYHnNgA7ZxZtg/exec',
  pushChave: 'BHdg_Z8I7aldes47TyGfeqPHH8MOeVDovFJDwldVjpoLiYJhmlFS5dJLRvmaujqq4oYfETMtDYpCem3VfP0cISw',
  marca: {
    slogan: 'Mais que churros, é propósito.',
    assistente: 'Atendente do Churros',
    tema: 'classico',
    cores: { destaque: '#d99a3e', botao: '#d64545', fundo: '#1a0f0a' },
    logos: { cardapio: 'https://churrosdeproposito.github.io/app/logo.webp', impressao: 'https://churrosdeproposito.github.io/app/logo-impressao-cor.png', icone: 'https://churrosdeproposito.github.io/app/icon-512.png' },
    // Tema dos mini jogos do cliente (generico, burger ou churros)
    jogos: { tema: 'churros' }
  },
  modulos: { ifood: false, nfce: false, mercadopago: false, infinitepay: false, mesas: true, ponto: true, eventos: true, planilhas: true, ia: true }
};

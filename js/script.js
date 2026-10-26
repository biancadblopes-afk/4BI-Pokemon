const form = document.getElementById('form-busca');
const campo = document.getElementById('campoPesquisa');
const mensagem = document.getElementById('mensagem');
const resultado = document.getElementById('resultado');

const TIPOS = {
  normal: ['Normal', 'secondary'], fire: ['Fogo', 'danger'], water: ['Água', 'primary'],
  electric: ['Elétrico', 'warning'], grass: ['Planta', 'success'], ice: ['Gelo', 'info'],
  fighting: ['Lutador', 'danger'], poison: ['Veneno', 'dark'], ground: ['Terra', 'warning'],
  flying: ['Voador', 'info'], psychic: ['Psíquico', 'danger'], bug: ['Inseto', 'success'],
  rock: ['Pedra', 'secondary'], ghost: ['Fantasma', 'dark'], dragon: ['Dragão', 'primary'],
  dark: ['Sombrio', 'dark'], steel: ['Aço', 'secondary'], fairy: ['Fada', 'danger']
};
const STATS = [
  { api: 'hp', nome: 'HP', cor: 'bg-danger' },
  { api: 'attack', nome: 'Ataque', cor: 'bg-warning' },
  { api: 'defense', nome: 'Defesa', cor: 'bg-info' },
  { api: 'speed', nome: 'Velocidade', cor: 'bg-success' }
];

function mostrarMensagem(texto, tipo = 'danger') {
  mensagem.className = `alert alert-${tipo} mt-3 mb-0`;
  mensagem.textContent = texto;
}
function esconderMensagem() {
  mensagem.className = 'alert d-none mt-3 mb-0';
}
function mostrarPokemon(pokemon) {
  document.getElementById('txNome').textContent = pokemon.name.replaceAll('-', ' ');
  document.getElementById('txId').textContent = `#${pokemon.id}`;
  const imagem = document.getElementById('img-pokemon');
  imagem.src = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default || '';
  imagem.alt = `Imagem de ${pokemon.name}`;

  const tipos = document.getElementById('tipos');
  tipos.replaceChildren();
  pokemon.types.forEach(item => {
    const [nome, cor] = TIPOS[item.type.name] || [item.type.name, 'secondary'];
    const badge = document.createElement('span');
    badge.className = `badge bg-${cor} ${['warning', 'info'].includes(cor) ? 'text-dark' : ''}`;
    badge.textContent = nome;
    tipos.appendChild(badge);
  });

  document.getElementById('tvAltura').textContent = `${(pokemon.height / 10).toFixed(1)} m`;
  document.getElementById('tvPeso').textContent = `${(pokemon.weight / 10).toFixed(1)} kg`;

  const stats = document.getElementById('stats');
  stats.replaceChildren();
  STATS.forEach(stat => {
    const valor = pokemon.stats.find(s => s.stat.name === stat.api)?.base_stat ?? 0;
    const linha = document.createElement('div');
    linha.className = 'stat-linha';
    const rotulo = document.createElement('span');
    rotulo.className = 'stat-label';
    rotulo.textContent = stat.nome;
    const progresso = document.createElement('div');
    progresso.className = 'progress flex-grow-1';
    progresso.setAttribute('role', 'progressbar');
    progresso.setAttribute('aria-label', stat.nome);
    progresso.setAttribute('aria-valuenow', String(valor));
    progresso.setAttribute('aria-valuemin', '0');
    progresso.setAttribute('aria-valuemax', '255');
    const barra = document.createElement('div');
    barra.className = `progress-bar ${stat.cor}`;
    barra.style.width = `${Math.min(100, valor / 255 * 100)}%`;
    barra.textContent = valor;
    progresso.appendChild(barra);
    linha.append(rotulo, progresso);
    stats.appendChild(linha);
  });

  const habilidades = document.getElementById('habilidades');
  habilidades.replaceChildren();
  pokemon.abilities.forEach(item => {
    const badge = document.createElement('span');
    badge.className = 'badge bg-secondary';
    badge.textContent = item.ability.name.replaceAll('-', ' ');
    habilidades.appendChild(badge);
  });
  resultado.classList.remove('d-none');
}

async function buscar(termo) {
  const busca = termo.trim().toLowerCase();
  if (!busca) {
    mostrarMensagem('Digite o nome ou número de um Pokémon.', 'warning');
    return;
  }
  mostrarMensagem('Buscando Pokémon...', 'info');
  resultado.classList.add('d-none');
  try {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(busca)}`);
    if (!resposta.ok) throw new Error(resposta.status === 404 ? 'não encontrado' : 'erro na API');
    const pokemon = await resposta.json();
    mostrarPokemon(pokemon);
    esconderMensagem();
  } catch (erro) {
    mostrarMensagem(erro.message === 'não encontrado'
      ? 'Pokémon não encontrado. Confira o nome em inglês ou o número.'
      : 'Não foi possível consultar a PokéAPI. Verifique sua conexão e tente novamente.');
  }
}
form.addEventListener('submit', event => {
  event.preventDefault();
  buscar(campo.value);
});
buscar('pikachu');
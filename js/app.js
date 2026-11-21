const API_ORIGIN = (window.BARBERCOM_CONFIG && window.BARBERCOM_CONFIG.API_ORIGIN) || 'http://localhost:3000';
const assetUrl = (path) => {
  if (!path) return '';
  if (MOCK) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  return API_ORIGIN + (path.startsWith('/') ? path : '/' + path);
};


const $app = document.getElementById('app');
const S = { csrf:'', user:null, info:{}, servicos:[], sel:new Set(), unidade:null, data:'', hora:'', prof:null, profNome:'', resumo:null, fotoReferencia:null, ocupado:false };
const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl = v => 'R$ ' + Number(v).toFixed(2).replace('.', ',').replace(',00', '');
const soDigitos = v => String(v ?? '').replace(/\D/g, '').slice(0, 11);
const formatarTelefone = v => {
  const d = soDigitos(v);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
};
const mascaraTelefone = input => {
  if (!input) return;
  const aplicar = () => {
    const antes = input.value;
    const pos = input.selectionStart ?? antes.length;
    const digitosAntes = soDigitos(antes.slice(0, pos)).length;
    const formatado = formatarTelefone(antes);
    input.value = formatado;
    let cursor = formatado.length, cont = 0;
    for (let i = 0; i < formatado.length; i++) {
      if (/\d/.test(formatado[i])) cont++;
      if (cont >= digitosAntes) { cursor = i + 1; break; }
    }
    try { input.setSelectionRange(cursor, cursor); } catch {}
  };
  input.addEventListener('input', aplicar);
  input.addEventListener('blur', aplicar);
};
const soDigitos = v => String(v ?? '').replace(/\D/g, '').slice(0, 11);
const formatarTelefone = v => {
  const d = soDigitos(v);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
};
const mascaraTelefone = input => {
  if (!input) return;
  const aplicar = () => {
    const antes = input.value;
    const pos = input.selectionStart ?? antes.length;
    const digitosAntes = soDigitos(antes.slice(0, pos)).length;
    const formatado = formatarTelefone(antes);
    input.value = formatado;
    let cursor = formatado.length, cont = 0;
    for (let i = 0; i < formatado.length; i++) {
      if (/\d/.test(formatado[i])) cont++;
      if (cont >= digitosAntes) { cursor = i + 1; break; }
    }
    try { input.setSelectionRange(cursor, cursor); } catch {}
  };
  input.addEventListener('input', aplicar);
  input.addEventListener('blur', aplicar);
};
const ico = {
  casa:'<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  pino:'<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  sair:'<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
  predio:'<path d="M4 21V4h10v17M14 9h6v12M8 8h2M8 12h2M8 16h2M4 21h16"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 4 6"/>',
  calhora:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M12 13v3l2 1"/>',
  tesoura:'<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 7.5L20 18M8 16.5L20 6"/>',
  hist:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2"/>', power:'<path d="M12 3v9M6.5 6.5a8 8 0 1 0 11 0"/>', edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  seta:'<path d="M5 12h14M13 6l6 6-6 6"/>', volta:'<path d="M19 12H5M11 6l-6 6 6 6"/>'
};
const svg = (n, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ico[n]}</svg>`;


/* ---------- Modo exemplo: roda sem back-end (file:// ou ?mock=1). Dados FICTÍCIOS só para visualizar as telas. ---------- */
const LOGO = 'data:image/png;base64,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';
const MOCK = location.protocol === 'file:' || new URLSearchParams(location.search).has('mock');
const M = MOCK ? {
  perfil: null, id: 100,
  unidades: [{id:'1',nome:'Unidade Campo da Pólvora',endereco:'Av. Joana Angélica, 13',ativa:false,d:7},{id:'2',nome:'Unidade Barra',endereco:'Rua Aracaju, 133',ativa:true,d:8},{id:'3',nome:'Unidade Federação',endereco:'Rua Mãe Cleusa, 130',ativa:true,d:12}],
  servicos: [
    {id:'1',nome:'Massagem',ativo:true,p:25,m:30,ofertas:[{unidade_id:'2',preco:'25.00',duracao_minutos:30},{unidade_id:'3',preco:'25.00',duracao_minutos:30}]},
    {id:'2',nome:'Corte',ativo:true,p:25,m:30,ofertas:[{unidade_id:'2',preco:'25.00',duracao_minutos:30},{unidade_id:'3',preco:'25.00',duracao_minutos:30}]},
    {id:'3',nome:'Pintura',ativo:true,p:45,m:45,ofertas:[{unidade_id:'2',preco:'45.00',duracao_minutos:45},{unidade_id:'3',preco:'45.00',duracao_minutos:45}]},
    {id:'4',nome:'Barba',ativo:true,p:25,m:30,ofertas:[{unidade_id:'2',preco:'25.00',duracao_minutos:30},{unidade_id:'3',preco:'25.00',duracao_minutos:30}]}
  ],
  profs: [{id:'1',nome:'Pedro Sampaio',ativo:true,unidadesIds:['2','3'],servicosIds:['1','2','4'],foto_url:''},{id:'2',nome:'Jorge Matheus',ativo:true,unidadesIds:['2'],servicosIds:['1','2','4'],foto_url:''},{id:'3',nome:'Pedro Santana',ativo:false,unidadesIds:['3'],servicosIds:['1'],foto_url:''}],
  vinculos: [{id:'1',profissional:'Pedro Sampaio',profissionalId:'1',unidade:'Unidade Barra',unidadeId:'2'},{id:'2',profissional:'Pedro Sampaio',profissionalId:'1',unidade:'Unidade Federação',unidadeId:'3'},{id:'3',profissional:'Jorge Matheus',profissionalId:'2',unidade:'Unidade Barra',unidadeId:'2'}],
  turnos: [{id:'1',vinculo_id:'1',dia_semana:1,hora_inicio:'09:00:00',hora_fim:'18:00:00'},{id:'2',vinculo_id:'1',dia_semana:2,hora_inicio:'09:00:00',hora_fim:'18:00:00'}], pausas: [], bloqueios: [],
  ags: []
} : null;
function mockApi(rota, d) {
  const [path, qs] = rota.split('?'), q = new URLSearchParams(qs || ''), L = a => Promise.resolve(a);
  const sit = (lista, id, v) => { const x = lista.find(i => i.id === id); x[x.ativa !== undefined ? 'ativa' : 'ativo'] = d.ativa === 'true' || d.ativo === 'true'; return L({ mensagem: 'Situação atualizada.' }); };
  if (path === '/login') { if (d === undefined) return L({ csrf: 'x', googleDisponivel: false, demoGestor: true });
    M.perfil = ['gestor', 'gestor-demo'].includes(d.acesso) ? 'GESTOR' : 'CLIENTE'; return L({ csrf: 'x' }); }
  if (path === '/sessao') return L({ usuario: M.perfil ? { id: '1', nome: M.perfil === 'GESTOR' ? 'Gestor Demo' : 'Cliente Demo', perfil: M.perfil } : null, csrf: 'x' });
  if (path === '/sair') { M.perfil = null; return L({}); }
  if (path === '/cadastro') return L({ mensagem: 'ok' });
  const ofertasDe = servico => servico.ofertas || M.unidades.filter(u => u.ativa).map(u => ({ unidade_id: u.id, preco: servico.p.toFixed(2), duracao_minutos: servico.m }));
  const catalogoMock = () => ({
    servicos: M.servicos.map(x => ({ ...x, ofertas: ofertasDe(x).map(o => ({ ...o })) })),
    unidades: M.unidades.map(u => ({ ...u })),
    ofertas: M.servicos.flatMap(s => ofertasDe(s).map(o => {
      const unidade = M.unidades.find(u => u.id === String(o.unidade_id));
      return { servico_id: s.id, unidade_id: String(o.unidade_id), unidade_nome: unidade?.nome || 'Unidade', unidade_ativa: unidade?.ativa !== false, preco: String(o.preco), duracao_minutos: Number(o.duracao_minutos), ativa: true };
    }))
  });
  if (path === '/cliente/servicos') return L({ servicos: M.servicos.filter(x => x.ativo).flatMap(x => ofertasDe(x).filter(o => M.unidades.some(u => u.id === String(o.unidade_id) && u.ativa)).map(o => ({ id: x.id, nome: x.nome, unidade_id: String(o.unidade_id), preco: Number(o.preco).toFixed(2), duracao_minutos: Number(o.duracao_minutos) }))) });
  if (path === '/cliente/unidades') {
    const selecionados = (q.get('servicos') || '').split(',').filter(Boolean);
    const unidades = M.unidades.filter(u => u.ativa && (!selecionados.length || selecionados.every(id => {
      const servico = M.servicos.find(x => x.id === id);
      return servico?.ativo && ofertasDe(servico).some(o => String(o.unidade_id) === u.id);
    })));
    return L({ unidades: unidades.map(u => ({ ...u, distanciaKm: u.d })) });
  }
  if (path === '/cliente/disponibilidade') {
    const selecionados = (q.get('servicos') || '').split(',').filter(Boolean);
    const hs = [];
    for (let h = 9; h < 19; h++) for (const m of ['00', '30']) hs.push({
      hora: `${String(h).padStart(2, '0')}:${m}`,
      profissionais: M.profs.filter(p => p.ativo && (!q.get('profissional') || p.id === q.get('profissional')) &&
        selecionados.every(id => (p.servicosIds || []).includes(id))
      ).map(p => ({ id: p.id, nome: p.nome }))
    });
    return L({ horarios: hs });
  }
  if (path === '/cliente/resumo' || path === '/cliente/agendamentos' && d) {
    const its = M.servicos.filter(x => d.servicos.includes(x.id));
    const itens = its.map(x => {
      const oferta = ofertasDe(x).find(o => String(o.unidade_id) === String(d.unidade));
      const preco = Number(oferta?.preco ?? x.p), duracao = Number(oferta?.duracao_minutos ?? x.m);
      return { nome: x.nome, preco: preco.toFixed(2), duracao_minutos: duracao };
    });
    const r = { itens, duracaoMinutos: itens.reduce((a, x) => a + x.duracao_minutos, 0), valorTotal: itens.reduce((a, x) => a + Number(x.preco), 0).toFixed(2), profissional: M.profs.find(p => p.id === (d.profissional || '1')) };
    if (path === '/cliente/agendamentos') M.ags.unshift({ id: String(++M.id), inicio: `${d.data}T${d.hora}:00`, status: 'CONFIRMADO', valor_total: r.valorTotal, unidade: M.unidades.find(u => u.id === d.unidade).nome, profissional: r.profissional.nome, itens: r.itens, tem_referencia: !!d.fotoReferencia, foto_referencia_demo: d.fotoReferencia || null });
    return L(r);
  }
  if (path === '/cliente/historico') return L({ historico: [
    { id: 'hist-1', inicio: '2026-11-15T10:30:00', valor_total: '35.00', unidade: 'Unidade Barra', profissional: 'Pedro Sampaio', itens: [{ nome: 'Corte', preco: '35.00' }] },
    { id: 'hist-2', inicio: '2026-11-08T14:00:00', valor_total: '60.00', unidade: 'Unidade Federação', profissional: 'Jorge Matheus', itens: [{ nome: 'Corte', preco: '35.00' }, { nome: 'Barba', preco: '25.00' }] }
  ] });
  if (path === '/cliente/agendamentos') return L({ agendamentos: M.ags });
  if (/cancelar$/.test(path)) { M.ags.find(a => a.id === path.split('/')[3]).status = 'CANCELADO'; return L({ mensagem: 'Cancelado.' }); }
  if (path === '/unidades') return d ? (M.unidades.push({ id: String(++M.id), nome: d.nome, endereco: d.endereco, ativa: true }), L({ mensagem: 'Salvo.' })) : L({ unidades: M.unidades.map(u => ({ ...u })) });
  if (/^\/unidades\/\d+\/impacto$/.test(path)) return L({ quantidade: 0, proximos: [] });
  if (/^\/unidades\/\d+\/situacao/.test(path)) return sit(M.unidades, path.split('/')[2]);
  if (/^\/unidades\/\d+$/.test(path)) { Object.assign(M.unidades.find(u => u.id === path.split('/')[2]), { nome: d.nome, endereco: d.endereco }); return L({ mensagem: 'Salvo.' }); }
  if (path === '/servicos' && d) {
    const unidades = (Array.isArray(d.unidades) ? d.unidades : d.unidades ? [d.unidades] : []).map(String);
    if (!String(d.nome || '').trim() || !unidades.length) return Promise.reject(Object.assign(new Error('Informe o nome e selecione ao menos uma unidade.'), { status: 400 }));
    const ofertas = unidades.map(id => {
      const unidade = M.unidades.find(u => u.id === id);
      const precoRaw = String(d[`preco_${id}`] ?? '').trim();
      const duracaoRaw = String(d[`duracao_${id}`] ?? '').trim();
      if (!unidade || !unidade.ativa) throw Object.assign(new Error('Escolha uma unidade ativa.'), { status: 400 });
      if (!/^\d{1,8}([.,]\d{1,2})?$/.test(precoRaw) || !/^[1-9]\d{0,3}$/.test(duracaoRaw) || Number(duracaoRaw) > 1440) throw Object.assign(new Error('Confira o preço e a duração de cada unidade.'), { status: 400 });
      return { unidade_id: id, preco: Number(precoRaw.replace(',', '.')).toFixed(2), duracao_minutos: Number(duracaoRaw) };
    });
    const servico = { id: String(++M.id), nome: String(d.nome).trim(), ativo: d.ativo === 'true', ofertas, p: Number(ofertas[0].preco), m: ofertas[0].duracao_minutos };
    M.servicos.push(servico);
    return L({ mensagem: 'Serviço cadastrado.', proximaRota: '/servicos', servico: { id: servico.id } });
  }
  if (path === '/servicos') return L(catalogoMock());
  if (path === '/servicos/novo') return L({ ...catalogoMock(), form: { nome: '', ativo: true, unidades: [], precos: {}, duracoes: {} } });
  if (/^\/servicos\/\d+\/editar$/.test(path)) {
    const servico = M.servicos.find(x => x.id === path.split('/')[2]);
    if (!servico) return Promise.reject(Object.assign(new Error('Serviço não encontrado.'), { status: 404 }));
    const offers = ofertasDe(servico);
    return L({ ...catalogoMock(), form: { id: servico.id, nome: servico.nome, ativo: servico.ativo, unidades: offers.map(o => String(o.unidade_id)), precos: Object.fromEntries(offers.map(o => [String(o.unidade_id), String(o.preco)])), duracoes: Object.fromEntries(offers.map(o => [String(o.unidade_id), String(o.duracao_minutos)])) } });
  }
  if (/^\/servicos\/\d+\/situacao/.test(path)) return sit(M.servicos, path.split('/')[2]);
  if (/^\/servicos\/\d+$/.test(path) && d) {
    const servico = M.servicos.find(x => x.id === path.split('/')[2]);
    if (!servico) return Promise.reject(Object.assign(new Error('Serviço não encontrado.'), { status: 404 }));
    const unidades = (Array.isArray(d.unidades) ? d.unidades : d.unidades ? [d.unidades] : []).map(String);
    if (!String(d.nome || '').trim() || !unidades.length) return Promise.reject(Object.assign(new Error('Informe o nome e selecione ao menos uma unidade.'), { status: 400 }));
    const ofertas = unidades.map(id => {
      const unidade = M.unidades.find(u => u.id === id), oldOffer = ofertasDe(servico).find(o => String(o.unidade_id) === id);
      const precoRaw = String(d[`preco_${id}`] ?? '').trim(), duracaoRaw = String(d[`duracao_${id}`] ?? '').trim();
      if (!unidade || (!unidade.ativa && !oldOffer)) throw Object.assign(new Error('Escolha uma unidade válida e ativa.'), { status: 400 });
      if (!/^\d{1,8}([.,]\d{1,2})?$/.test(precoRaw) || !/^[1-9]\d{0,3}$/.test(duracaoRaw) || Number(duracaoRaw) > 1440) throw Object.assign(new Error('Confira o preço e a duração de cada unidade.'), { status: 400 });
      return { unidade_id: id, preco: Number(precoRaw.replace(',', '.')).toFixed(2), duracao_minutos: Number(duracaoRaw) };
    });
    servico.nome = String(d.nome).trim(); servico.ativo = d.ativo === 'true'; servico.ofertas = ofertas;
    servico.p = Number(ofertas[0].preco); servico.m = ofertas[0].duracao_minutos;
    return L({ mensagem: 'Serviço atualizado.', proximaRota: '/servicos', servico: { id: servico.id } });
  }
  const profMockList = () => M.profs.map(p => ({ ...p, unidades: (p.unidadesIds || []).map(id => M.unidades.find(u => u.id === id)?.nome).filter(Boolean), servicos: (p.servicosIds || []).map(id => M.servicos.find(v => v.id === id)?.nome).filter(Boolean) }));
  if (path === '/profissionais' && d) { const id = String(++M.id); M.profs.push({ id, nome: d.nome, ativo: d.ativo === 'true', foto_url: d.foto_url || '', unidadesIds: d.unidades || [], servicosIds: d.servicos || [] }); return L({ mensagem: 'Profissional cadastrado.', profissional: { id } }); }
  if (path === '/profissionais') return L({ profissionais: profMockList(), unidades: M.unidades, servicos: M.servicos });
  if (/^\/profissionais\/\d+\/editar$/.test(path)) { const p = M.profs.find(v => v.id === path.split('/')[2]); if (!p) return Promise.reject(Object.assign(new Error('Profissional não encontrado.'), {status:404})); return L({ profissionais: profMockList(), unidades: M.unidades, servicos: M.servicos, form: { id:p.id,nome:p.nome,ativo:p.ativo,foto_url:p.foto_url||'',unidades:p.unidadesIds||[],servicos:p.servicosIds||[] } }); }
  if (/^\/profissionais\/\d+$/.test(path) && d) { const p=M.profs.find(v=>v.id===path.split('/')[2]); Object.assign(p,{nome:d.nome,ativo:d.ativo==='true',foto_url:d.foto_url||'',unidadesIds:d.unidades||[],servicosIds:d.servicos||[]}); return L({mensagem:'Profissional atualizado.',profissional:{id:p.id}}); }
  if (/^\/profissionais\/\d+\/impacto$/.test(path)) return L({ quantidade: 0, proximos: [] });
  if (/^\/profissionais\/\d+\/situacao/.test(path)) return sit(M.profs, path.split('/')[2]);
  if (path === '/horarios' && d) { const arr = d.tipo === 'turno' ? M.turnos : d.tipo === 'pausa' ? M.pausas : M.bloqueios; if (d.remover === 'true') { const i=arr.findIndex(v=>v.id===d.id); if(i>=0)arr.splice(i,1); } else if (d.tipo === 'turno') { for(const day of d.dias||[]) { const row={id:d.id||String(++M.id),vinculo_id:d.vinculo,dia_semana:Number(day),hora_inicio:d.inicio,hora_fim:d.fim}; if(d.id){const i=arr.findIndex(v=>v.id===d.id);if(i>=0)arr.splice(i,1,row);else arr.push(row);}else arr.push(row); } } else { const row=d.tipo==='pausa' ? {id:d.id||String(++M.id),vinculo_id:d.vinculo,turno_id:d.turno,descricao:d.descricao,hora_inicio:d.inicio,hora_fim:d.fim} : {id:d.id||String(++M.id),vinculo_id:d.vinculo,descricao:d.descricao,data:d.data,data_label:d.data,tipo:d.motivo,hora_inicio:d.dia_inteiro==='true'?null:d.inicio,hora_fim:d.dia_inteiro==='true'?null:d.fim}; if(d.id){const i=arr.findIndex(v=>v.id===d.id);if(i>=0)arr.splice(i,1,row);else arr.push(row);}else arr.push(row); } return L({mensagem:'Horário salvo.'}); }
  if (path === '/horarios') { const v=q.get('vinculo')||'1', selected=M.vinculos.find(x=>x.id===v)||M.vinculos[0]; return L({vinculos:M.vinculos,selected,turnos:M.turnos.filter(x=>x.vinculo_id===selected.id),pausas:M.pausas.filter(x=>x.vinculo_id===selected.id),bloqueios:M.bloqueios.filter(x=>x.vinculo_id===selected.id)}); }
  if (path === '/gestao/historico') return L({ atendimentos: [{ id: '1', inicio: '2026-01-14T15:30:00', status: 'CONFIRMADO', valor_total: '80.00', unidade: 'Unidade Campo da Pólvora', cliente: 'cli-8842', itens: 'Corte, Massagem' }] });
  return Promise.reject(Object.assign(new Error('Rota não existe no modo exemplo: ' + path), { status: 404 }));
}
async function api(rota, dados, extra = {}) {
  if (MOCK) return mockApi(rota, dados);
  const r = await fetch(API_ORIGIN + '/api' + rota, {
    method: dados === undefined ? 'GET' : 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(S.csrf ? { 'X-CSRF-Token': S.csrf } : {}) },
    body: dados === undefined ? undefined : JSON.stringify(dados), ...extra
  });
  let j = {};
  try { j = await r.json(); } catch {}
  if (j.csrf) S.csrf = j.csrf;
  if (!r.ok) { const e = new Error(j.erro || ({401:'Entre para continuar.',403:'Sem permissão.',429:'Muitas tentativas. Aguarde um pouco.',503:'Serviço indisponível.'}[r.status] || 'Não foi possível concluir.')); e.status = r.status; throw e; }
  return j;
}

function tela(titulo, corpo, { sair = true, nav = '' } = {}) {
  $app.innerHTML = `<header class="topo"><img src="${MOCK ? LOGO : '/logo.png'}" alt="BarberCom">${sair && S.user ? `<button class="sair" id="sair" aria-label="Sair">${svg('sair')}</button>` : ''}</header>
  <main>${titulo ? `<h1>${esc(titulo)}</h1>` : ''}<div id="aviso" role="alert"></div>${corpo}</main>${nav ? barra(nav) : ''}`;
  const s = document.getElementById('sair');
  if (s) s.onclick = async () => { try { await api('/sair', {}); } catch {} S.user = null; resetar(); await iniciar(); location.hash = '#login'; };
  document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => location.hash = b.dataset.go);
}
const barra = atual => `<nav class="bar" aria-label="Principal">${[['casa','#servicos','Início'],['pino','#unidades','Unidades'],['cal','#agenda','Meus agendamentos'],['user','#perfil','Conta']].map(([i,h,t]) =>
  `<button data-go="${h}" aria-label="${t}" ${h === atual ? 'aria-current="page"' : ''}>${svg(i)}</button>`).join('')}</nav>`;
const aviso = (m, t = 'erro') => { const a = document.getElementById('aviso'); if (a) a.innerHTML = m ? `<div class="msg ${t}">${esc(m)}</div>` : ''; };
const resetar = () => { S.sel = new Set(); S.unidade = S.hora = S.data = ''; S.prof = null; S.profNome = ''; S.resumo = null; S.fotoReferencia = null; };
const rodape = (voltar, texto, avancar, ativo = true) => `<div class="linha"><button class="btn" data-go="${voltar}" aria-label="Voltar">${svg('volta')}</button><button class="btn" id="avancar" ${ativo ? '' : 'disabled'}>${texto} ${svg('seta', 18)}</button></div>`;

/* ---------- Login / cadastro ---------- */
function login() {
  tela('', `<div style="height:36px"></div>
  <form id="f" novalidate><label for="tel">Telefone</label><input id="tel" inputmode="tel" autocomplete="username" placeholder="(71) 9 1234-5678" required>
  <label for="sen">Senha</label><input id="sen" type="password" autocomplete="current-password" placeholder="********" required>
  <button class="btn full" style="margin-top:24px" id="ent" type="submit">Entrar como cliente</button>
  <button class="btn sec full" style="margin-top:10px" id="ent-admin" type="button">Acessar como administrador</button></form>
  <div class="ou">OU</div>
  <button class="google" id="g" ${S.info.googleDisponivel ? '' : 'disabled title="Google não configurado neste ambiente"'}><svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17.1z"/><path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2 1.4-4.7 2.3-8.5 2.3-6.3 0-11.6-4.100-13.500-9.800l-7.900 6.100C6.500 42.600 14.600 48 24 48z"/></svg>Entrar com google</button>
  <button class="link" data-go="#cadastro">Criar conta de cliente</button>`, { sair: false });
  const tel = document.getElementById('tel'), sen = document.getElementById('sen');
  mascaraTelefone(tel);
  async function entrar(extra = {}, btn) {
    aviso('');
    if (!tel.value.trim() || !sen.value) return aviso('Preencha telefone e senha.');
    if (S.ocupado) return; S.ocupado = true; btn.disabled = true;
    try {
      await api('/login', { telefone: soDigitos(tel.value) || tel.value, senha: sen.value, ...extra });
      await sessao(); rotear();
    } catch (e) { aviso(e.message); } finally { S.ocupado = false; btn.disabled = false; }
  }
  document.getElementById('f').onsubmit = e => { e.preventDefault(); entrar({ acesso: 'cliente' }, document.getElementById('ent')); };
  document.getElementById('ent-admin').onclick = () => {
    const digits = soDigitos(tel.value);
    const acesso = S.info.demoGestor && digits.length < 10 ? 'gestor-demo' : 'gestor';
    entrar({ acesso }, document.getElementById('ent-admin'));
  };
  document.getElementById('g').onclick = async () => { try { location.href = (await api('/auth/google')).autorizacaoUrl; } catch (e) { aviso(e.message); } };
}
function cadastro() {
  tela('Criar conta', `<form id="f" novalidate><label for="n">Nome</label><input id="n" autocomplete="name" required maxlength="120">
  <label for="t">Telefone (com DDD)</label><input id="t" inputmode="tel" autocomplete="tel" placeholder="(71) 9 1234-5678" required>
  <label for="s">Senha (mínimo 12 caracteres)</label><input id="s" type="password" autocomplete="new-password" required minlength="12">
  <button class="btn full" style="margin-top:24px" id="ok">Cadastrar</button></form><button class="link" data-go="#login">Já tenho conta</button>`, { sair: false });
  mascaraTelefone(document.getElementById('t'));
  document.getElementById('f').onsubmit = async e => {
    e.preventDefault(); aviso(''); const b = document.getElementById('ok');
    const tel = soDigitos(document.getElementById('t').value), senha = document.getElementById('s').value, nome = document.getElementById('n').value.trim();
    if (!nome) return aviso('Informe seu nome.');
    if (tel.length < 10 || tel.length > 11) return aviso('Telefone deve ter DDD e 10 ou 11 dígitos.');
    if (senha.length < 12) return aviso('A senha precisa de pelo menos 12 caracteres.');
    if (S.ocupado) return; S.ocupado = true; b.disabled = true;
    try { await api('/cadastro', { nome, telefone: tel, senha }); location.hash = '#login'; setTimeout(() => aviso('Conta criada. Entre com telefone e senha.', 'info'), 50); }
    catch (er) { aviso(er.message); } finally { S.ocupado = false; b.disabled = false; }
  };
}

/* ---------- Fluxo do cliente ---------- */
async function servicos() {
  tela('Escolha o serviço', '<p class="vazio">Carregando…</p>', { nav: '#servicos' });
  try {
    const { servicos: lista } = await api('/cliente/servicos');
    const mapa = new Map();
    for (const o of lista) { const s = mapa.get(o.id) || { id: o.id, nome: o.nome, ofertas: [] }; s.ofertas.push(o); mapa.set(o.id, s); }
    S.servicos = [...mapa.values()];
    desenharServicos();
  } catch (e) { tela('Escolha o serviço', '', { nav: '#servicos' }); aviso(e.message); }
}
function desenharServicos() {
  const cards = S.servicos.map(s => {
    const preco = Math.min(...s.ofertas.map(o => +o.preco)), dur = Math.min(...s.ofertas.map(o => o.duracao_minutos));
    return `<button class="card opcao" data-id="${esc(s.id)}" aria-pressed="${S.sel.has(s.id)}"><span class="l1"><span>${esc(s.nome.toUpperCase())}</span><span>${brl(preco)}</span></span><span class="l2 mudo" style="display:block">${dur}min</span></button>`;
  }).join('') || '<p class="vazio">Nenhum serviço disponível no momento.</p>';
  tela('Escolha o serviço', cards + `<button class="btn full" id="avancar" ${S.sel.size ? '' : 'disabled'}>Continuar ${svg('seta', 18)}</button>`, { nav: '#servicos' });
  document.querySelectorAll('.opcao').forEach(b => b.onclick = () => { const id = b.dataset.id; S.sel.has(id) ? S.sel.delete(id) : S.sel.add(id); S.fotoReferencia = null; S.unidade = null; S.hora = ''; S.prof = null; S.profNome = ''; desenharServicos(); });
  const a = document.getElementById('avancar'); if (a) a.onclick = () => location.hash = '#unidades';
}
async function unidades() {
  if (!S.sel.size) return (location.hash = '#servicos');
  tela('Escolha a unidade', '<p class="vazio">Carregando…</p>', { nav: '#unidades' });
  try {
    const { unidades: us } = await api('/cliente/unidades?servicos=' + [...S.sel].join(','));
    const cards = us.map(u => `<button class="card opcao" data-id="${esc(u.id)}" aria-pressed="${S.unidade === u.id}"><span class="l1"><span>${esc(u.nome)}</span><span>${u.distanciaKm != null ? Math.round(u.distanciaKm) + 'km' : ''}</span></span><span class="l2" style="display:block">${esc(u.endereco)}</span></button>`).join('') || '<p class="vazio">Nenhuma unidade oferece todos esses serviços.</p>';
    tela('Escolha a unidade', cards + rodape('#servicos', 'Continuar', 0, !!S.unidade), { nav: '#unidades' });
    document.querySelectorAll('.opcao').forEach(b => b.onclick = () => { S.unidade = b.dataset.id; S.hora = ''; S.prof = null; S.profNome = ''; unidades(); });
    const a = document.getElementById('avancar'); if (a) a.onclick = () => location.hash = '#horarios';
  } catch (e) { aviso(e.message); }
}
const diasProx = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
async function horarios() {
  if (!S.unidade) return (location.hash = '#unidades');
  if (!S.data) S.data = iso(new Date());
  if (S.data < iso(new Date())) S.data = iso(new Date());
  tela('Escolha o profissional', '<p class="vazio">Consultando horários disponíveis…</p>', { nav: '#unidades' });
  let r;
  try {
    const qs = new URLSearchParams({ unidade: S.unidade, servicos: [...S.sel].join(','), data: S.data });
    r = await api(`/cliente/disponibilidade?${qs.toString()}`);
  } catch (e) { return aviso(e.message); }

  const slots = Array.isArray(r.horarios) ? r.horarios : [];
  const profs = new Map();
  for (const h of slots) for (const p of (h.profissionais || [])) profs.set(String(p.id), p.nome);
  // Se o profissional escolhido não tiver mais horário nesta data, mantenha-o visível
  // e explique a indisponibilidade, em vez de deixar a seleção invisível.
  if (S.prof && !profs.has(String(S.prof)) && S.profNome) profs.set(String(S.prof), S.profNome);
  const nomeDia = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  const dias = `<div class="dias" role="group" aria-label="Escolha rápida do dia">${diasProx().map(d => `<button type="button" class="dia" data-d="${iso(d)}" aria-pressed="${iso(d) === S.data}">${nomeDia[d.getDay()]}<b>${d.getDate()}</b></button>`).join('')}</div>`;
  const seletorData = `<div class="data-escolhida"><label for="dataEscolhida">Ou escolha outra data</label><input id="dataEscolhida" type="date" min="${iso(new Date())}" value="${esc(S.data)}"></div>`;
  const horasDe = pid => slots.filter(h => pid == null || (h.profissionais || []).some(p => String(p.id) === String(pid))).map(h => h.hora);
  const bloco = (pid, nome) => {
    const chave = pid == null ? null : String(pid);
    const aberto = S.prof === chave;
    const hs = horasDe(chave);
    const ini = pid == null ? '·' : String(nome || 'P').split(/\s+/).filter(Boolean).slice(0, 2).map(x => x[0]).join('').toUpperCase();
    const foto = pid == null ? '' : `<img src="${assetUrl('/fotos/profissionais/' + encodeURIComponent(chave))}" alt="" onerror="this.remove()">`;
    const conteudoHoras = hs.length
      ? `<div class="horas">${hs.map(h => `<button type="button" class="hora" data-h="${esc(h)}" aria-pressed="${S.hora === h}">${esc(h)}</button>`).join('')}</div>`
      : `<p class="vazio">${pid == null ? 'Nenhum horário disponível nesta data.' : 'Este profissional não possui horários livres nesta data. Escolha outro dia ou outro profissional.'}</p>`;
    return `<div class="card"><button type="button" class="prof" data-p="${esc(chave ?? '')}" aria-expanded="${aberto}"><span class="foto">${esc(ini)}${foto}</span><span style="flex:1;text-align:center">${esc(nome)}</span></button>${aberto ? `<div style="margin-top:12px">${dias}${seletorData}${conteudoHoras}</div>` : ''}</div>`;
  };
  const staff = [...profs.entries()];
  const nenhum = staff.length === 0 ? `<div class="indisponivel">Nenhum profissional possui disponibilidade para os serviços, unidade e data selecionados.</div>` : '';
  tela('Escolha o profissional', bloco(null, 'Sem preferência') + staff.map(([id, nome]) => bloco(id, nome)).join('') + nenhum + rodape('#unidades', 'Continuar', 0, !!S.hora), { nav: '#unidades' });
  document.querySelectorAll('.prof').forEach(b => b.onclick = () => {
    const pid = b.dataset.p || null;
    if (pid && pid === S.prof) { S.prof = null; S.profNome = ''; }
    else { S.prof = pid; S.profNome = pid ? (profs.get(pid) || '') : ''; }
    S.hora = '';
    horarios();
  });
  document.querySelectorAll('.dia').forEach(b => b.onclick = () => {
    S.data = b.dataset.d; S.hora = ''; horarios();
  });
  const dateInput = document.getElementById('dataEscolhida');
  if (dateInput) dateInput.onchange = () => {
    if (!dateInput.value) return;
    if (dateInput.value < iso(new Date())) return aviso('Escolha hoje ou uma data futura.');
    S.data = dateInput.value; S.hora = ''; horarios();
  };
  document.querySelectorAll('.hora').forEach(b => b.onclick = () => { S.hora = b.dataset.h; horarios(); });
  const a = document.getElementById('avancar'); if (a) a.onclick = () => location.hash = '#resumo';
}
const corpoReserva = () => ({ unidade: S.unidade, servicos: [...S.sel], data: S.data, hora: S.hora, ...(S.prof ? { profissional: S.prof } : {}) });
const incluiCorte = itens => (itens || []).some(i => /corte|cabelo/i.test(String(i.nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')));
function vincularFotoReferencia() {
  const input = document.getElementById('fotoReferenciaArquivo');
  const preview = document.getElementById('fotoReferenciaPreview');
  const image = document.getElementById('fotoReferenciaImagem');
  const remover = document.getElementById('removerFotoReferencia');
  if (!input || !preview || !image || !remover) return;
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) { input.value = ''; S.fotoReferencia = null; return aviso('Use uma imagem JPG, PNG ou WEBP.'); }
    if (file.size > 2 * 1024 * 1024) { input.value = ''; S.fotoReferencia = null; return aviso('A imagem deve ter no máximo 2 MB.'); }
    const reader = new FileReader();
    reader.onload = () => {
      if (input.files?.[0] !== file || typeof reader.result !== 'string') return;
      S.fotoReferencia = reader.result; image.src = reader.result; preview.classList.add('visivel'); aviso('');
    };
    reader.onerror = () => aviso('Não foi possível ler a imagem. Escolha outro arquivo.');
    reader.readAsDataURL(file);
  };
  remover.onclick = () => { S.fotoReferencia = null; input.value = ''; image.removeAttribute('src'); preview.classList.remove('visivel'); };
}
async function resumo() {
  if (!S.hora) return (location.hash = '#horarios');
  tela('', '<p class="vazio">Carregando…</p>', { nav: '#unidades' });
  try {
    const r = await api('/cliente/resumo', corpoReserva());
    const u = (await api('/cliente/unidades?servicos=' + [...S.sel].join(','))).unidades.find(x => x.id === S.unidade) || {};
    const d = new Date(S.data + 'T12:00:00'), dd = ['dom','seg','ter','qua','qui','sex','sab'][d.getDay()];
    const blocoReferencia = incluiCorte(r.itens) ? `<div class="referencia-corte"><h3>Foto de referência do corte (opcional)</h3><p>Você pode enviar uma foto do corte que deseja. Mesmo selecionando Corte + Barba, a imagem pode ser apenas do cabelo. Não é obrigatório.</p><input type="file" id="fotoReferenciaArquivo" accept="image/jpeg,image/png,image/webp"><div class="referencia-preview" id="fotoReferenciaPreview"><img id="fotoReferenciaImagem" alt="Prévia da foto de referência"><button type="button" class="referencia-remover" id="removerFotoReferencia">Remover foto</button></div></div>` : '';
    tela('', `<div class="card resumo"><h2>Confirme o Agendamento</h2><div class="mudo" style="font-weight:500">Serviços</div>
    ${r.itens.map(i => `<div class="sec r"><span>${esc(i.nome.toUpperCase())}</span><span>${brl(i.preco)}</span></div>`).join('')}
    ${blocoReferencia}
    <div class="sec"><div class="mudo" style="font-weight:500">Profissional</div><div style="text-align:center;font-weight:800;font-size:18px;margin-top:6px">${S.prof ? esc(r.profissional.nome) : `Sem preferência · atribuído automaticamente: ${esc(r.profissional.nome)}`}</div></div>
    <div class="sec"><div class="mudo" style="font-weight:500">Local Atendimento</div><div class="r"><span>${esc(u.nome || '')}</span><span>${u.distanciaKm != null ? Math.round(u.distanciaKm) + 'km' : ''}</span></div><div style="font-size:11px">${esc(u.endereco || '')}</div></div>
    <div class="sec tri"><div><span class="mudo" style="font-weight:500">Dia e Horário</span><b>${dd} ${d.getDate()} ${esc(S.hora)}</b></div><div><span class="mudo" style="font-weight:500">Tempo Serviços</span><b>${r.duracaoMinutos} min</b></div><div><span class="mudo" style="font-weight:500">Valor Total</span><b>${brl(r.valorTotal).replace('R$ ', 'R$ ')}</b></div></div></div>
    <div class="linha"><button class="btn" data-go="#horarios" aria-label="Voltar">${svg('volta')}</button><button class="btn" id="avancar">Confirmar Agendamento</button></div>`, { nav: '#unidades' });
    vincularFotoReferencia();
    document.getElementById('avancar').onclick = async e => {
      if (S.ocupado) return; S.ocupado = true; e.target.disabled = true; aviso('');
      try { await api('/cliente/agendamentos', { ...corpoReserva(), ...(S.fotoReferencia ? { fotoReferencia: S.fotoReferencia } : {}) }); resetar(); location.hash = '#ok'; }
      catch (er) { aviso(er.message); if (er.status === 409) setTimeout(() => (location.hash = '#horarios'), 1800); }
      finally { S.ocupado = false; e.target.disabled = false; }
    };
  } catch (e) { aviso(e.message); }
}
function ok() {
  tela('', `<p style="text-align:center;font-size:24px;margin:28px 0 0">Agendamento confirmado</p><div class="check"><svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
  <button class="btn full" data-go="#servicos" style="max-width:280px;margin:0 auto">Voltar ao início</button>`, { nav: '#servicos' });
}
async function agenda() {
  tela('Meus agendamentos', '<p class="vazio">Carregando…</p>', { nav: '#agenda' });
  try {
    const { agendamentos } = await api('/cliente/agendamentos');
    const agora = new Date();
    const f = a => { const [d, h] = a.inicio.split('T'); return `${d.split('-').reverse().join('/')} às ${h.slice(0, 5)}`; };
    const html = agendamentos.map(a => `<div class="card"><div class="l1" style="display:flex;justify-content:space-between;font-weight:800"><span>${esc(a.unidade)}</span><span>${brl(a.valor_total)}</span></div>
      <div style="margin:6px 0;font-size:14px">${f(a)} · ${esc(a.profissional)}</div><div class="mudo">${esc(a.itens.map(i => i.nome).join(', '))}</div>
      ${a.tem_referencia ? `<div class="mudo" style="margin-top:10px;font-size:12px">Foto de referência enviada</div><img class="ref-historico" src="${MOCK ? esc(a.foto_referencia_demo || '') : `${API_ORIGIN}/api/cliente/agendamentos/${encodeURIComponent(a.id)}/referencia`}" alt="Foto de referência do corte">` : ''}
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px"><b style="font-size:13px;color:${a.status === 'CANCELADO' ? 'var(--erro)' : 'var(--ok)'}">${esc(a.status)}</b>
      ${a.status === 'CONFIRMADO' && new Date(a.inicio) > agora ? `<button class="btn" data-c="${esc(a.id)}" style="height:38px;font-size:14px">Cancelar</button>` : ''}</div></div>`).join('');
    tela('Meus agendamentos', html || '<p class="vazio">Você ainda não tem agendamentos.</p>', { nav: '#agenda' });
    document.querySelectorAll('[data-c]').forEach(b => b.onclick = async () => {
      if (!confirm('Cancelar este agendamento?')) return; b.disabled = true;
      try { await api(`/cliente/agendamentos/${b.dataset.c}/cancelar`, {}); agenda(); } catch (e) { aviso(e.message); b.disabled = false; }
    });
  } catch (e) { aviso(e.message); }
}
async function perfil() {
  tela('Conta', `<div class="card"><b>${esc(S.user?.nome)}</b><div class="mudo">Cliente</div></div>
    <div class="hist-sec-titulo"><h2>Histórico de cortes</h2><span class="mudo" id="hist-contagem">Carregando…</span></div>
    <div id="historico-cliente"><p class="vazio">Carregando seu histórico…</p></div>`, { nav: '#perfil' });
  try {
    const { historico = [] } = await api('/cliente/historico');
    const lista = historico.map(a => {
      const [dia, horario = ''] = String(a.inicio || '').split('T');
      const data = /^\d{4}-\d{2}-\d{2}$/.test(dia) ? dia.split('-').reverse().join('/') : 'Data não informada';
      const hora = horario.slice(0, 5);
      const servicos = Array.isArray(a.itens) ? a.itens.map(i => esc(i.nome)).join(' + ') : '';
      return `<article class="card hist-cliente">
        <div class="hist-cliente-top"><span class="hist-cliente-nome">${servicos || 'Serviço realizado'}</span><span class="badge on">Concluído</span></div>
        <div class="hist-cliente-detalhe"><span>${data}${hora ? ` às ${hora}` : ''}</span><span>${esc(a.unidade || 'Unidade não informada')}</span><span>Profissional: ${esc(a.profissional || 'Não informado')}</span></div>
        ${a.tem_referencia ? `<div class="ajuda">Foto de referência anexada neste agendamento</div><img class="ref-historico" src="${MOCK ? esc(a.foto_referencia_demo || '') : `${API_ORIGIN}/api/cliente/agendamentos/${encodeURIComponent(a.id)}/referencia`}" alt="Foto de referência do corte">` : ''}
        <div class="hist-cliente-rodape"><span class="mudo">Valor pago</span><strong class="hist-cliente-valor">${brl(a.valor_total)}</strong></div>
      </article>`;
    }).join('');
    const contagem = document.getElementById('hist-contagem');
    const alvo = document.getElementById('historico-cliente');
    if (contagem) contagem.textContent = `${historico.length} ${historico.length === 1 ? 'registro' : 'registros'}`;
    if (alvo) alvo.innerHTML = lista || '<div class="card vazio">Você ainda não tem cortes concluídos. Quando um atendimento for finalizado, ele aparecerá aqui.</div>';
  } catch (e) {
    const alvo = document.getElementById('historico-cliente');
    if (alvo) alvo.innerHTML = `<div class="msg erro">${esc(e.message || 'Não foi possível carregar seu histórico.')}</div>`;
    const contagem = document.getElementById('hist-contagem');
    if (contagem) contagem.textContent = '';
  }
}

/* ---------- Gestor ---------- */
const abas = [['predio','#unidades-g','Unidades'],['users','#profissionais-g','Profissionais'],['calhora','#horarios-g','Horários'],['tesoura','#servicos-g','Serviços'],['hist','#historico-g','Histórico']];
const navG = a => `<nav class="bar" aria-label="Gestão">${abas.map(([i,h,t]) => `<button data-go="${h}" aria-label="${t}" ${h === a ? 'aria-current="page"' : ''}>${svg(i, 24)}</button>`).join('')}</nav>`;
const tg = (t, c, a) => { tela(t, c, { nav: '' }); $app.insertAdjacentHTML('beforeend', navG(a)); document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => location.hash = b.dataset.go); };
const ativoDe = x => (x.ativa ?? x.ativo) === true || (x.ativa ?? x.ativo) === 'true';
const badge = on => `<span class="badge ${on ? 'on' : 'off'}">● ${on ? 'Ativ' : 'Inativ'}${on ? 'o' : 'o'}</span>`;
function cartaoG(x, tipo, corpo, femin) {
  const on = ativoDe(x), L = femin ? [on ? 'Ativa' : (tipo === 'servicos' ? 'Desativada' : 'Inativa')] : [on ? 'Ativo' : 'Inativo'];
  return `<article class="card" data-id="${esc(x.id)}"><div class="r" style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b>${esc(x.nome)}</b><span class="badge ${on ? 'on' : 'off'}">● ${L}</span></div>${corpo}
  <hr style="border:0;border-top:1px solid var(--linha);margin:12px 0"><div class="linha" style="margin:0"><button class="btn sec" data-ed="${esc(x.id)}" style="flex:1;height:42px">${svg('edit', 16)} Editar</button>
  <button class="btn ${on ? 'perigo' : 'reat'}" data-t="${esc(x.id)}" aria-pressed="${on}" style="flex:1;height:42px">${svg('power', 16)} ${on ? (tipo === 'servicos' ? 'Desativar' : 'Inativar') : 'Reativar'}</button></div></article>`;
}
async function listaG(tipo, titulo, novo, femin, corpo, aba) {
  tg(titulo, '<p class="vazio">Carregando…</p>', aba);
  let d; try { d = await api('/' + tipo); } catch (e) { return aviso(e.message); }
  const itens = d[tipo]; window._itens = itens;
  tg(titulo, `<button class="btn full" id="novo" style="max-width:260px;margin:0 auto 14px">＋ ${novo}</button><div id="lista">${itens.map(x => cartaoG(x, tipo, corpo(x, d), femin)).join('') || '<p class="vazio">Nada cadastrado ainda.</p>'}</div>`, aba);
  const aqui = () => document.getElementById('lista');
  aqui().onclick = async e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.ed !== undefined) return formG(tipo, itens.find(x => x.id === b.dataset.ed), aba);
    const x = itens.find(i => i.id === b.dataset.t), campo = tipo === 'unidades' ? 'ativa' : 'ativo';
    if (!x || S.ocupado) return;
    const estavaAtivo = ativoDe(x), novoAtivo = !estavaAtivo;
    S.ocupado = true; b.disabled = true;
    try {
      let cancelarAgendamentos = false;
      if (estavaAtivo && ['unidades', 'profissionais'].includes(tipo)) {
        const impacto = await api(`/${tipo}/${encodeURIComponent(x.id)}/impacto`);
        const quantidade = Number(impacto.quantidade || 0);
        const proximos = (impacto.proximos || []).slice(0, 5).map(a => {
          const dataHora = String(a.inicio || '').replace('T', ' ').slice(0, 16);
          return `• ${dataHora} · ${a.cliente || 'Cliente'}${a.unidade ? ` · ${a.unidade}` : ''}`;
        }).join('\n');
        const detalhe = proximos ? `\n\nPróximos registros:\n${proximos}` : '';
        const mensagem = quantidade > 0
          ? `Atenção: ${tipo === 'unidades' ? 'esta unidade está relacionada a' : 'este profissional possui'} ${quantidade} agendamento(s) futuro(s) confirmado(s).${detalhe}\n\nSe continuar, TODOS esses agendamentos serão marcados como CANCELADOS. Os clientes não recebem notificação automática pelo sistema; será necessário avisá-los por outro canal.\n\nOK = cancelar as reservas e desativar. Cancelar = manter ativo para resolver as reservas primeiro.`
          : `Deseja ${novoAtivo ? 'reativar' : 'desativar'} ${tipo === 'unidades' ? 'a unidade' : 'o profissional'} “${x.nome}”? O histórico será preservado.`;
        if (!window.confirm(mensagem)) {
          aviso(quantidade > 0 ? 'O cadastro continua ativo. Nenhum agendamento foi alterado.' : 'Operação cancelada.', 'info');
          return;
        }
        cancelarAgendamentos = quantidade > 0;
      } else if (estavaAtivo && !window.confirm(`Deseja desativar “${x.nome}”?`)) {
        aviso('Operação cancelada.', 'info');
        return;
      }
      const resultado = await api(`/${tipo}/${encodeURIComponent(x.id)}/situacao`, {
        [campo]: String(novoAtivo),
        ...(cancelarAgendamentos ? { cancelarAgendamentos: true } : {})
      });
      x[campo] = novoAtivo;
      const card = aqui().querySelector(`[data-id="${x.id}"]`);
      if (card) card.outerHTML = cartaoG(x, tipo, corpo(x, d), femin);
      aviso(resultado.mensagem || 'Situação atualizada.', 'info');
    }
    catch (er) { aviso(er.message); b.disabled = false; }
    finally { S.ocupado = false; }
  };
  document.getElementById('novo').onclick = () => formG(tipo, null, aba);
}
async function formProfissionalG(x, aba) {
  tg(x ? 'Editar profissional' : 'Novo profissional', '<p class="vazio">Carregando opções…</p>', aba);
  try {
    const d = await api(x ? `/profissionais/${encodeURIComponent(x.id)}/editar` : '/profissionais');
    const f = d.form || { nome: '', foto_url: '', ativo: true, unidades: [], servicos: [] };
    const unidadesSelecionadas = new Set((f.unidades || []).map(String));
    const servicosSelecionados = new Set((f.servicos || []).map(String));
    const fotoAtual = f.foto_url || '';
    const iniciais = String(f.nome || 'P').split(/\s+/).filter(Boolean).slice(0, 2).map(v => v[0]).join('').toUpperCase();
    const listaChecks = (lista, selecionados, campo, nomeAtivo) => lista.map(item => {
      const id = String(item.id), selecionado = selecionados.has(id), ativo = item[nomeAtivo] !== false;
      return `<label class="check-item"><input type="checkbox" name="${campo}" value="${esc(id)}" ${selecionado ? 'checked' : ''}><span>${esc(item.nome)}${ativo ? '' : ' (inativo)'}</span></label>`;
    }).join('') || '<p class="ajuda">Nenhum registro cadastrado.</p>';
    const html = `<form id="formProfissional" novalidate>
      <label for="profNome">Nome completo</label><input id="profNome" maxlength="120" autocomplete="name" value="${esc(f.nome || '')}" required>
      <div class="admin-secao"><h2>Foto do profissional</h2><div class="foto-preview"><span class="foto" id="fotoPreview">${esc(iniciais)}${fotoAtual ? `<img src="${esc(fotoAtual)}" alt="Foto atual" onerror="this.remove()">` : ''}</span><div><b>Foto de perfil</b><p class="ajuda">JPEG ou PNG, até 2 MB. A imagem será otimizada pelo servidor.</p></div></div><input type="file" id="fotoArquivo" accept="image/jpeg,image/png"><input type="hidden" id="fotoUrl" value="${esc(fotoAtual)}"></div>
      <div class="admin-secao"><h2>Unidades de trabalho</h2><p class="ajuda">Selecione todas as unidades em que o profissional atende.</p><div class="check-grid">${listaChecks(d.unidades || [], unidadesSelecionadas, 'unidades', 'ativa')}</div></div>
      <div class="admin-secao"><h2>Serviços realizados</h2><p class="ajuda">O cliente só poderá agendar serviços vinculados ao profissional.</p><div class="check-grid">${listaChecks(d.servicos || [], servicosSelecionados, 'servicos', 'ativo')}</div></div>
      <label class="check-item" style="margin-top:16px"><input type="checkbox" id="profAtivo" ${f.ativo !== false ? 'checked' : ''}><span>Profissional ativo</span></label>
      <div class="form-acoes"><button type="button" class="btn sec" data-go="${aba}">Cancelar</button><button type="submit" class="btn" id="salvarProfissional">Salvar profissional</button></div>
    </form>`;
    tg(x ? 'Editar profissional' : 'Novo profissional', html, aba);
    const fileInput = document.getElementById('fotoArquivo');
    const preview = document.getElementById('fotoPreview');
    fileInput.onchange = () => {
      const file = fileInput.files?.[0];
      if (!file) {
        preview.innerHTML = `${esc(iniciais)}${fotoAtual ? `<img src="${esc(fotoAtual)}" alt="Foto atual" onerror="this.remove()">` : ''}`;
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 2 * 1024 * 1024) {
        fileInput.value = '';
        aviso('Escolha uma imagem JPEG ou PNG de até 2 MB.');
        return;
      }
      const leitor = new FileReader();
      leitor.onload = () => {
        if (fileInput.files?.[0] === file && typeof leitor.result === 'string') {
          preview.innerHTML = `<img src="${leitor.result}" alt="Pré-visualização da foto">`;
        }
      };
      leitor.onerror = () => aviso('Não foi possível ler esta imagem. Escolha outro arquivo.');
      leitor.readAsDataURL(file);
    };
    let currentId = x?.id ? String(x.id) : null;
    document.getElementById('formProfissional').onsubmit = async ev => {
      ev.preventDefault();
      const nome = document.getElementById('profNome').value.trim();
      const unidades = [...document.querySelectorAll('input[name="unidades"]:checked')].map(el => el.value);
      const servicos = [...document.querySelectorAll('input[name="servicos"]:checked')].map(el => el.value);
      const foto = fileInput.files?.[0] || null;
      if (!nome) return aviso('Informe o nome do profissional.');
      if (!unidades.length) return aviso('Selecione pelo menos uma unidade.');
      if (!servicos.length) return aviso('Selecione pelo menos um serviço.');
      if (foto && (!['image/jpeg', 'image/png'].includes(foto.type) || foto.size > 2 * 1024 * 1024)) return aviso('A foto precisa ser JPEG ou PNG de até 2 MB.');
      if (S.ocupado) return;
      S.ocupado = true;
      const btn = document.getElementById('salvarProfissional'); btn.disabled = true;
      try {
        const body = { nome, ativo: String(document.getElementById('profAtivo').checked), unidades, servicos, foto_url: document.getElementById('fotoUrl').value };
        const result = await api(currentId ? `/profissionais/${encodeURIComponent(currentId)}` : '/profissionais', body);
        currentId = String(result.profissional?.id || currentId || '');
        if (foto) {
          if (!currentId) throw new Error('O cadastro foi salvo, mas a API não retornou o ID necessário para anexar a foto.');
          try { await enviarFotoProfissional(currentId, foto); }
          catch (fotoError) {
            aviso(`Os dados do profissional foram salvos, mas a foto não foi enviada: ${fotoError.message}. Você pode tentar novamente sem cadastrar o profissional outra vez.`);
            btn.disabled = false;
            return;
          }
        }
        location.hash = aba; rotear();
      } catch (er) { aviso(er.message); btn.disabled = false; }
      finally { S.ocupado = false; }
    };
  } catch (er) { tg(x ? 'Editar profissional' : 'Novo profissional', `<div class="msg erro">${esc(er.message)}</div><button class="btn full" data-go="${aba}">Voltar</button>`, aba); }
}
async function enviarFotoProfissional(id, arquivo) {
  if (MOCK) return { mensagem: 'Foto simulada no modo de demonstração.', foto_url: `${API_ORIGIN}/fotos/profissionais/${id}` };
  const resposta = await fetch(`${API_ORIGIN}/api/profissionais/${encodeURIComponent(id)}/foto`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': arquivo.type, ...(S.csrf ? { 'X-CSRF-Token': S.csrf } : {}) },
    body: arquivo
  });
  let resultado = {};
  try { resultado = await resposta.json(); } catch {}
  if (resultado.csrf) S.csrf = resultado.csrf;
  if (!resposta.ok) throw new Error(resultado.erro || 'Não foi possível enviar a foto.');
  return resultado;
}
async function formServicoG(x, aba) {
  tg(x ? 'Editar serviço' : 'Novo serviço', '<p class="vazio">Carregando unidades e valores…</p>', aba);
  try {
    const d = await api(x ? `/servicos/${encodeURIComponent(x.id)}/editar` : '/servicos/novo');
    const f = d.form || { nome: '', ativo: true, unidades: [], precos: {}, duracoes: {} };
    const selecionadas = new Set((f.unidades || []).map(String));
    const ofertas = d.ofertas || [];
    const unidadesHtml = (d.unidades || []).map(unidade => {
      const id = String(unidade.id), selected = selecionadas.has(id);
      const oferta = ofertas.find(o => String(o.servico_id) === String(f.id || x?.id) && String(o.unidade_id) === id);
      const preco = f.precos?.[id] ?? oferta?.preco ?? '';
      const duracao = f.duracoes?.[id] ?? oferta?.duracao_minutos ?? '';
      const disabled = unidade.ativa === false && !selected;
      return `<section class="card admin-secao" style="margin-bottom:10px"><label class="check-item" style="margin:0"><input type="checkbox" data-service-unit value="${esc(id)}" ${selected ? 'checked' : ''} ${disabled ? 'disabled' : ''}><span>${esc(unidade.nome)}${unidade.ativa === false ? ' (inativa)' : ''}</span></label><div class="form-linha"><label>Preço (R$)<input type="text" inputmode="decimal" id="servicePrice_${esc(id)}" value="${esc(preco)}" placeholder="35,00" maxlength="11"></label><label>Duração (min)<input type="number" id="serviceDuration_${esc(id)}" value="${esc(duracao)}" min="1" max="1440" placeholder="30"></label></div></section>`;
    }).join('') || '<p class="ajuda">Nenhuma unidade cadastrada. Cadastre uma unidade antes de criar um serviço.</p>';
    const html = `<form id="formServico" novalidate><label for="servicoNome">Nome do serviço</label><input id="servicoNome" maxlength="120" value="${esc(f.nome || x?.nome || '')}" placeholder="Ex.: Corte" required><p class="ajuda">Defina em quais unidades o serviço será oferecido e configure preço e duração para cada uma.</p><div class="admin-secao"><h2>Unidades, preços e duração</h2>${unidadesHtml}</div><label class="check-item" style="margin-top:14px"><input type="checkbox" id="servicoAtivo" ${f.ativo !== false ? 'checked' : ''}><span>Serviço ativo e disponível para agendamento</span></label><div class="form-acoes"><button type="button" class="btn sec" data-go="${aba}">Cancelar</button><button type="submit" class="btn" id="salvarServico">Salvar serviço</button></div></form>`;
    tg(x ? 'Editar serviço' : 'Novo serviço', html, aba);
    document.getElementById('formServico').onsubmit = async ev => {
      ev.preventDefault();
      const nome = document.getElementById('servicoNome').value.trim();
      const unidades = [...document.querySelectorAll('[data-service-unit]:checked')].map(el => el.value);
      if (!nome) return aviso('Informe o nome do serviço.');
      if (!unidades.length) return aviso('Selecione pelo menos uma unidade.');
      const body = { nome, ativo: String(document.getElementById('servicoAtivo').checked), unidades };
      for (const id of unidades) {
        const preco = document.getElementById(`servicePrice_${id}`).value.trim();
        const duracao = document.getElementById(`serviceDuration_${id}`).value.trim();
        if (!/^\d{1,8}([.,]\d{1,2})?$/.test(preco)) return aviso('Informe um preço válido para cada unidade. Exemplo: 35,00.');
        if (!/^[1-9]\d{0,3}$/.test(duracao) || Number(duracao) > 1440) return aviso('A duração deve ser de 1 a 1440 minutos.');
        body[`preco_${id}`] = preco;
        body[`duracao_${id}`] = duracao;
      }
      if (S.ocupado) return;
      S.ocupado = true;
      const btn = document.getElementById('salvarServico'); btn.disabled = true;
      try {
        await api(x ? `/servicos/${encodeURIComponent(x.id)}` : '/servicos', body);
        aviso(x ? 'Serviço atualizado.' : 'Serviço cadastrado.', 'info');
        location.hash = aba;
        rotear();
      } catch (er) { aviso(er.message); btn.disabled = false; }
      finally { S.ocupado = false; }
    };
  } catch (er) {
    tg(x ? 'Editar serviço' : 'Novo serviço', `<div class="msg erro">${esc(er.message)}</div><button class="btn full" data-go="${aba}">Voltar</button>`, aba);
  }
}
function formG(tipo, x, aba) {
  if (tipo === 'profissionais') return formProfissionalG(x, aba);
  if (tipo === 'servicos') return formServicoG(x, aba);
  if (tipo !== 'unidades') return aviso('O formulário deste cadastro ainda não foi implementado.');
  tg(x ? 'Editar unidade' : 'Nova unidade', `<form id="f" novalidate><label for="n">Nome</label><input id="n" value="${esc(x?.nome)}" required maxlength="120"><label for="e">Endereço</label><input id="e" value="${esc(x?.endereco)}" required maxlength="255">
  <div class="linha"><button type="button" class="btn" data-go="${aba}">${svg('volta')}</button><button class="btn" id="ok">Salvar</button></div></form>`, aba);
  document.getElementById('f').onsubmit = async ev => { ev.preventDefault(); const n = document.getElementById('n').value.trim(), en = document.getElementById('e').value.trim();
    if (!n || !en) return aviso('Preencha nome e endereço.'); document.getElementById('ok').disabled = true;
    try { await api(x ? `/unidades/${x.id}` : '/unidades', { nome: n, endereco: en, ativa: String(x ? ativoDe(x) : true) }); location.hash = aba; rotear(); }
    catch (er) { aviso(er.message); document.getElementById('ok').disabled = false; } };
}
const unidadesG = () => listaG('unidades', 'Gerenciamento de unidades', 'Nova unidade', true, x => `<p class="mudo" style="font-weight:500;margin:8px 0 0">${esc(x.endereco)}</p>`, '#unidades-g');
const iniciaisNome = nome => String(nome || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(v => v[0]).join('').toUpperCase();
const profissionaisG = () => listaG('profissionais', 'Gerenciamento de profissionais', 'Novo profissional', false, x => `<div class="prof-resumo"><span class="foto">${esc(iniciaisNome(x.nome))}${x.foto_url ? `<img src="${esc(assetUrl(x.foto_url))}" alt="Foto de ${esc(x.nome)}" onerror="this.remove()">` : ''}</span><div style="min-width:0"><p class="mudo" style="font-weight:600;margin:0 0 4px">${esc((Array.isArray(x.unidades) ? x.unidades : []).join(' · ') || x.unidades_nomes || 'Sem unidade vinculada')}</p><div style="font-size:12px">${esc((Array.isArray(x.servicos) ? x.servicos : []).join(' · ') || x.servicos_nomes || 'Sem serviço vinculado')}</div></div></div>`, '#profissionais-g');
const servicosG = () => listaG('servicos', 'Gerenciamento de serviços', 'Novo serviço', false, (x, d) => (d.ofertas || []).filter(o => String(o.servico_id) === String(x.id)).map(o => `<div style="font-size:13px;margin-top:6px">${esc(o.unidade_nome)} · <b>${brl(o.preco)}</b> · ${o.duracao_minutos}min</div>`).join(''), '#servicos-g');

const diaNome = n => ({1:'Segunda',2:'Terça',3:'Quarta',4:'Quinta',5:'Sexta',6:'Sábado',7:'Domingo'}[Number(n)] || 'Dia');
const horaCurta = h => String(h || '').slice(0, 5);
async function horariosG(vinculo = '') {
  tg('Gerenciamento de horários', '<p class="vazio">Carregando turnos e bloqueios…</p>', '#horarios-g');
  try {
    const d = await api('/horarios' + (vinculo ? `?vinculo=${encodeURIComponent(vinculo)}` : ''));
    if (!d.vinculos?.length) {
      tg('Gerenciamento de horários', '<div class="msg info">Cadastre um profissional e vincule-o a uma unidade antes de configurar os horários.</div>', '#horarios-g');
      return;
    }
    const linkId = String(d.selected?.id || d.vinculos[0].id);
    const turnos = d.turnos || [], pausas = d.pausas || [], bloqueios = d.bloqueios || [];
    const options = d.vinculos.map(v => `<option value="${esc(v.id)}" ${String(v.id) === linkId ? 'selected' : ''}>${esc(v.profissional)} · ${esc(v.unidade)}</option>`).join('');
    const diasChecks = [1,2,3,4,5,6,7].map(n => `<label class="check-item"><input type="checkbox" name="diasTurno" value="${n}"><span>${diaNome(n)}</span></label>`).join('');
    const listTurnos = turnos.map(t => `<div class="registro"><div class="registro-topo"><b>${diaNome(t.dia_semana)}</b><span>${horaCurta(t.hora_inicio)}–${horaCurta(t.hora_fim)}</span></div><div class="registro-acoes"><button type="button" data-edit-turno="${esc(t.id)}">Editar</button><button type="button" class="remover" data-remove-turno="${esc(t.id)}">Remover</button></div></div>`).join('') || '<p class="ajuda">Nenhum turno cadastrado para este vínculo.</p>';
    const listPausas = pausas.map(pa => `<div class="registro"><div class="registro-topo"><b>${esc(pa.descricao)}</b><span>${diaNome(pa.dia_semana)} · ${horaCurta(pa.hora_inicio)}–${horaCurta(pa.hora_fim)}</span></div><div class="registro-acoes"><button type="button" data-edit-pausa="${esc(pa.id)}">Editar</button><button type="button" class="remover" data-remove-pausa="${esc(pa.id)}">Remover</button></div></div>`).join('') || '<p class="ajuda">Nenhuma pausa cadastrada.</p>';
    const listBloqueios = bloqueios.map(bl => `<div class="registro"><div class="registro-topo"><b>${esc(bl.descricao)}</b><span>${esc(bl.data_label || String(bl.data || '').slice(0,10))} · ${bl.hora_inicio ? `${horaCurta(bl.hora_inicio)}–${horaCurta(bl.hora_fim)}` : 'Dia inteiro'}</span></div><div class="ajuda">${bl.tipo === 'FERIADO' ? 'Feriado' : 'Indisponibilidade'}</div><div class="registro-acoes"><button type="button" data-edit-bloqueio="${esc(bl.id)}">Editar</button><button type="button" class="remover" data-remove-bloqueio="${esc(bl.id)}">Remover</button></div></div>`).join('') || '<p class="ajuda">Nenhum bloqueio cadastrado.</p>';
    const pauseOptions = turnos.map(t => `<option value="${esc(t.id)}">${diaNome(t.dia_semana)} · ${horaCurta(t.hora_inicio)}–${horaCurta(t.hora_fim)}</option>`).join('');
    const html = `<div class="card"><label for="v" style="margin-top:0">Profissional / unidade</label><select id="v">${options}</select><p class="ajuda">Os horários pertencem ao vínculo entre este profissional e esta unidade.</p></div>
      <section class="card admin-secao"><h2>Turnos de trabalho</h2><p class="ajuda">Marque os dias e informe a janela em que o profissional atende.</p><form id="formTurno"><input id="turnoId" type="hidden"><div class="check-grid">${diasChecks}</div><div class="form-linha"><label for="turnoInicio">Início<input id="turnoInicio" type="time" required></label><label for="turnoFim">Fim<input id="turnoFim" type="time" required></label></div><div class="form-acoes"><button class="btn" id="salvarTurno">Adicionar turno</button><button type="button" class="btn sec" id="cancelarTurno" hidden>Cancelar edição</button></div></form><div class="lista-registros">${listTurnos}</div></section>
      <section class="card admin-secao"><h2>Pausas e intervalos</h2><p class="ajuda">Cadastre almoço ou outros intervalos dentro de um turno existente.</p><form id="formPausa"><input id="pausaId" type="hidden"><label for="pausaTurno">Turno</label><select id="pausaTurno" required>${pauseOptions}</select><label for="pausaDescricao">Descrição</label><input id="pausaDescricao" maxlength="120" placeholder="Ex.: Almoço" required><div class="form-linha"><label for="pausaInicio">Início<input id="pausaInicio" type="time" required></label><label for="pausaFim">Fim<input id="pausaFim" type="time" required></label></div><div class="form-acoes"><button class="btn" id="salvarPausa" ${turnos.length ? '' : 'disabled'}>Adicionar pausa</button><button type="button" class="btn sec" id="cancelarPausa" hidden>Cancelar edição</button></div></form><div class="lista-registros">${listPausas}</div></section>
      <section class="card admin-secao"><h2>Feriados e indisponibilidades</h2><p class="ajuda">Bloqueie um dia inteiro ou apenas um intervalo específico.</p><form id="formBloqueio"><input id="bloqueioId" type="hidden"><label for="bloqueioDescricao">Descrição</label><input id="bloqueioDescricao" maxlength="120" placeholder="Ex.: Compromisso pessoal" required><div class="form-linha"><label for="bloqueioData">Data<input id="bloqueioData" type="date" required></label><label for="bloqueioMotivo">Tipo<select id="bloqueioMotivo"><option value="INDISPONIBILIDADE">Indisponibilidade</option><option value="FERIADO">Feriado</option></select></label></div><label class="check-item" style="margin-top:12px"><input type="checkbox" id="bloqueioDiaInteiro" checked><span>Bloquear o dia inteiro</span></label><div class="form-linha" id="intervaloBloqueio" hidden><label for="bloqueioInicio">Início<input id="bloqueioInicio" type="time"></label><label for="bloqueioFim">Fim<input id="bloqueioFim" type="time"></label></div><div class="form-acoes"><button class="btn" id="salvarBloqueio">Adicionar bloqueio</button><button type="button" class="btn sec" id="cancelarBloqueio" hidden>Cancelar edição</button></div></form><div class="lista-registros">${listBloqueios}</div></section>`;
    tg('Gerenciamento de horários', html, '#horarios-g');
    document.getElementById('v').onchange = ev => horariosG(ev.target.value);
    const formTurno = document.getElementById('formTurno');
    const resetTurno = () => { formTurno.reset(); document.getElementById('turnoId').value=''; document.getElementById('salvarTurno').textContent='Adicionar turno'; document.getElementById('cancelarTurno').hidden=true; };
    document.getElementById('cancelarTurno').onclick = resetTurno;
    formTurno.onsubmit = async ev => {
      ev.preventDefault(); const dias = [...formTurno.querySelectorAll('[name="diasTurno"]:checked')].map(el => el.value);
      if (!dias.length) return aviso('Selecione pelo menos um dia da semana.');
      if (document.getElementById('turnoId').value && dias.length !== 1) return aviso('Ao editar, selecione somente um dia para este turno.');
      const inicio=document.getElementById('turnoInicio').value, fim=document.getElementById('turnoFim').value;
      if (!inicio || !fim || inicio >= fim) return aviso('Informe um horário final posterior ao inicial.');
      await salvarHorario('/horarios', {vinculo:linkId,tipo:'turno',...(document.getElementById('turnoId').value?{id:document.getElementById('turnoId').value}:{}),dias,inicio,fim}, linkId, document.getElementById('salvarTurno'));
    };
    document.querySelectorAll('[data-edit-turno]').forEach(b => b.onclick = () => {
      const t=turnos.find(v=>String(v.id)===b.dataset.editTurno); if(!t)return;
      resetTurno(); document.getElementById('turnoId').value=t.id; document.querySelector(`[name="diasTurno"][value="${Number(t.dia_semana)}"]`).checked=true;
      document.getElementById('turnoInicio').value=horaCurta(t.hora_inicio); document.getElementById('turnoFim').value=horaCurta(t.hora_fim);
      document.getElementById('salvarTurno').textContent='Salvar alteração'; document.getElementById('cancelarTurno').hidden=false;
      formTurno.scrollIntoView({behavior:'smooth',block:'center'});
    });
    document.querySelectorAll('[data-remove-turno]').forEach(b=>b.onclick=()=>removerHorario('turno',b.dataset.removeTurno,linkId));

    const formPausa=document.getElementById('formPausa');
    const resetPausa=()=>{formPausa.reset();document.getElementById('pausaId').value='';document.getElementById('salvarPausa').textContent='Adicionar pausa';document.getElementById('cancelarPausa').hidden=true;};
    document.getElementById('cancelarPausa').onclick=resetPausa;
    formPausa.onsubmit=async ev=>{ev.preventDefault();const inicio=document.getElementById('pausaInicio').value,fim=document.getElementById('pausaFim').value;if(!inicio||!fim||inicio>=fim)return aviso('Informe um intervalo válido para a pausa.');
      await salvarHorario('/horarios',{vinculo:linkId,tipo:'pausa',...(document.getElementById('pausaId').value?{id:document.getElementById('pausaId').value}:{}),turno:document.getElementById('pausaTurno').value,descricao:document.getElementById('pausaDescricao').value.trim(),inicio,fim},linkId,document.getElementById('salvarPausa'));};
    document.querySelectorAll('[data-edit-pausa]').forEach(b=>b.onclick=()=>{const pa=pausas.find(v=>String(v.id)===b.dataset.editPausa);if(!pa)return;resetPausa();document.getElementById('pausaId').value=pa.id;document.getElementById('pausaTurno').value=String(pa.turno_id);document.getElementById('pausaDescricao').value=pa.descricao;document.getElementById('pausaInicio').value=horaCurta(pa.hora_inicio);document.getElementById('pausaFim').value=horaCurta(pa.hora_fim);document.getElementById('salvarPausa').textContent='Salvar alteração';document.getElementById('cancelarPausa').hidden=false;formPausa.scrollIntoView({behavior:'smooth',block:'center'});});
    document.querySelectorAll('[data-remove-pausa]').forEach(b=>b.onclick=()=>removerHorario('pausa',b.dataset.removePausa,linkId));

    const formBloqueio=document.getElementById('formBloqueio'), fullDay=document.getElementById('bloqueioDiaInteiro'), interval=document.getElementById('intervaloBloqueio');
    fullDay.onchange=()=>{interval.hidden=fullDay.checked;document.getElementById('bloqueioInicio').required=!fullDay.checked;document.getElementById('bloqueioFim').required=!fullDay.checked;};
    const resetBloqueio=()=>{formBloqueio.reset();document.getElementById('bloqueioId').value='';fullDay.checked=true;fullDay.onchange();document.getElementById('salvarBloqueio').textContent='Adicionar bloqueio';document.getElementById('cancelarBloqueio').hidden=true;};
    document.getElementById('cancelarBloqueio').onclick=resetBloqueio;
    formBloqueio.onsubmit=async ev=>{ev.preventDefault();const body={vinculo:linkId,tipo:'bloqueio',...(document.getElementById('bloqueioId').value?{id:document.getElementById('bloqueioId').value}:{}),descricao:document.getElementById('bloqueioDescricao').value.trim(),data:document.getElementById('bloqueioData').value,motivo:document.getElementById('bloqueioMotivo').value,dia_inteiro:String(fullDay.checked)};if(!body.data)return aviso('Escolha a data do bloqueio.');if(!fullDay.checked){body.inicio=document.getElementById('bloqueioInicio').value;body.fim=document.getElementById('bloqueioFim').value;if(!body.inicio||!body.fim||body.inicio>=body.fim)return aviso('Informe um intervalo válido para o bloqueio.');}await salvarHorario('/horarios',body,linkId,document.getElementById('salvarBloqueio'));};
    document.querySelectorAll('[data-edit-bloqueio]').forEach(b=>b.onclick=()=>{const bl=bloqueios.find(v=>String(v.id)===b.dataset.editBloqueio);if(!bl)return;resetBloqueio();document.getElementById('bloqueioId').value=bl.id;document.getElementById('bloqueioDescricao').value=bl.descricao;document.getElementById('bloqueioData').value=String(bl.data).slice(0,10);document.getElementById('bloqueioMotivo').value=bl.tipo;fullDay.checked=!bl.hora_inicio;fullDay.onchange();if(bl.hora_inicio){document.getElementById('bloqueioInicio').value=horaCurta(bl.hora_inicio);document.getElementById('bloqueioFim').value=horaCurta(bl.hora_fim);}document.getElementById('salvarBloqueio').textContent='Salvar alteração';document.getElementById('cancelarBloqueio').hidden=false;formBloqueio.scrollIntoView({behavior:'smooth',block:'center'});});
    document.querySelectorAll('[data-remove-bloqueio]').forEach(b=>b.onclick=()=>removerHorario('bloqueio',b.dataset.removeBloqueio,linkId));
  } catch (e) { aviso(e.message); }
}
async function salvarHorario(path, body, vinculo, button) {
  if(S.ocupado)return;S.ocupado=true;button.disabled=true;
  try{await api(path,body);await horariosG(vinculo);}
  catch(e){aviso(e.message);button.disabled=false;}
  finally{S.ocupado=false;}
}
async function removerHorario(tipo,id,vinculo){
  const nomes={turno:'este turno',pausa:'esta pausa',bloqueio:'este bloqueio'};
  if(!confirm(`Deseja remover ${nomes[tipo]}?`))return;
  try{await api('/horarios',{vinculo,tipo,id,remover:'true'});await horariosG(vinculo);}
  catch(e){aviso(e.message);}
}
async function historicoG() {
  tg('Histórico entre unidades', '<p class="vazio">Carregando…</p>', '#historico-g');
  try { const { atendimentos } = await api('/gestao/historico');
    tg('Histórico entre unidades', atendimentos.map(a => { const [dt, h] = a.inicio.split('T');
      return `<div class="card"><div style="display:flex;justify-content:space-between"><b>${dt.split('-').reverse().join('/')} · ${h.slice(0, 5)}</b><b>${brl(a.valor_total)}</b></div><div class="mudo" style="margin-top:6px">${esc(a.status)} · ${esc(a.cliente)}</div><div style="font-size:13px;margin-top:4px">${esc(a.itens)} · ${esc(a.unidade)}</div>${a.tem_referencia ? `<p class="ajuda">Referência de corte anexada</p><img class="ref-historico" src="/api/gestao/agendamentos/${encodeURIComponent(a.id)}/referencia" alt="Foto de referência do corte">` : ''}</div>`; }).join('') || '<p class="vazio">Nenhum atendimento encontrado.</p>', '#historico-g');
  } catch (e) { aviso(e.message); }
}

/* ---------- Sessão e rotas ---------- */
async function sessao() { const j = await api('/sessao'); S.user = j.usuario; }
async function iniciar() { S.info = await api('/login'); await sessao(); }
const rotas = { login, cadastro, servicos, unidades, horarios, resumo, ok, agenda, perfil, 'unidades-g': unidadesG, 'profissionais-g': profissionaisG, 'horarios-g': horariosG, 'servicos-g': servicosG, 'historico-g': historicoG };
const publicas = ['login', 'cadastro'];
function rotear() {
  let r = location.hash.slice(1);
  if (!S.user) { if (!publicas.includes(r)) r = 'login'; }
  else if (S.user.perfil === 'GESTOR') { if (!r.endsWith('-g')) r = 'unidades-g'; }
  else if (!r || publicas.includes(r) || r.endsWith('-g')) r = 'servicos';
  if (location.hash !== '#' + r) { location.hash = '#' + r; return; }
  rotas[r]();
}
window.addEventListener('hashchange', rotear);
iniciar().then(rotear).catch(e => { $app.innerHTML = `<main><h1>Sem conexão</h1><div class="msg erro">Não foi possível falar com o servidor (${esc(e.message)}). Confira se o back-end está rodando.</div></main>`; });

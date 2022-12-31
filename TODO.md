
# 6POK

### Development Plan

#### Imediato

- [x] Atualizar para a versão atual do ImpactJS
- [x] Aumentar a área dos mapas;
- [x] Adicionar uma câmera;
- [x] Criar passagens;
    - [x] Manter estados das áreas; Manter informações no game class.
    - [x] Criar grafo de áreas;
- [ ] Criar esconderijos;
    - [ ] Tocas no solo;
    - [ ] Troncos de árvores;
    - [x] Arbustos;
    - [ ] Tocas nas árvores;
    - [ ] Tocas nas rochas;
- [x] Implementar a visibilidades nos esconderijos;
- [x] Implementar visualização das estatísticas;
- [ ] Implementar ataque básico de investida;
- [ ] Implementar sistema de batalha;
- [ ] Implementar feedback de pontos de dano;
- [ ] Implementar feedback de vitória;
- [ ] Implementar sistema de turnos em tempo ativo;
- [x] Implementar mensagem de feedback;
- [ ] Criar as fontes de energia;
- [ ] Criar pedras de sal;
- [ ] Implementar visualização do inventório;
- [ ] Criar plantas;
    - [ ] Criar frutas e sementes;
    - [ ] Criar folhas, flores, néctar e pólen;
    - [ ] Criar raízes;
    - [ ] Implementar produção periódica;
    - [ ] Criar áreas férteis;
    - [ ] Implementar a plantação de sementes;
        - [ ] Implementar mensagem de ação e acesso ao invetório;
    - [ ] Implementar crescimentos das plantas;
    - [ ] Implementar nascimentos espontâneo;
- [ ] Implementar comportamentos dos animais (individuais):
    - [ ] Fugir
    - [ ] Lutar
    - [ ] Esconder
    - [ ] Migrar
    - [ ] Hibernar
    - [ ] Reproduzir
    - [ ] Caçar
    - [ ] Pastar
    - [ ] Coletar
    - [ ] Patrular
    - [ ] Seguir
    - [ ] Dormir
    - [ ] Descansar
    - [ ] Procurar
    - [ ] Explorar
- [x] Implementar sistema de experiência.
- [ ] Transição de câmera quando houver mais de um jogador.
- [ ] Tratar o armazenamento de diferentes jogadores.
- [ ] Menu de configurações do jogo alterando a velocidade de movimentação dos animais.

#### Próximos Passos

- [ ] Adicionar comportamentos na classe de animais que podem ser selecionados pelo settings. Por exemplo, o comportamento jogador direciona as ações para as entradas do usuário sobrescevendo o método process.

- [ ] Criar grupo de entidades que compartilham o mesmo idgroup no mapa.
- [ ] Criar mapa de testes.
- [ ] Criar aleatorização dos animais.
- [ ] Criar classe de animais.
- [ ] Criar atributos.
- [ ] Criar malha com animais.
- [ ] Criar sistema de turnos em tempo ativo.
- [ ] Criar esconderijos.
- [ ] Criar portais.
- [ ] Criar malhas temáticas.
- [ ] Determinar tipos.

- [ ] Utilizar heat map path finding em relação ao personagem, objetivos (portal, distância segura de ataque) e adversários.


- [ ] Planejar ataques temáticos por tipo
- [ ] Planejar cenários temáticos
- [ ] Gerar o grafo de mapas com regiões de mesmo tema próximas
- [ ] Planejar sistema de itens
- [ ] Desenvolver itens

### Issues

- [x] O animal move-se uma vez a cada duas do jogador;
- [x] O jogador deve mudar de direção oposta sem se mover;
- [x] Está sendo disparada a colisão com outro objeto quando o animal colide com a borda do mapa.
- [x] A grama não está escondendo os animais.
- [x] O animal não está mudando de orientação ao se mover para uma direção diferente.
- [x] O personagem está sendo transportado para a área inicial ao usar um portal de retorno.
- [x] PHP está sendo processado uma única vez. Já testei deferentes pacotes como node-php, php-express, mas nenhum funcionou melhor que o SPHP. Testar node CGI implementando midlleware para processsar PHP ou então interceptar as páginas PHP substituindo-as por código JS.
    - Alterar o backend para nodejs (código do weltmeister).
    - Alterar path no config.js
    - Alterar consultas ajax
        - [] entities: 21
        - [] select-file-dropdown: 31
        - [] weltmeister: 315
        - [x] weltmeister: 462
    - Aparentemente o problema foi resolvido somente com o código para save.php.

### Future Works

- [ ] Adicionar imagens de transição entre tipos de mapas usando transparência

### References

[https://ict.usc.edu/pubs/Computational%20Models%20of%20Emotion.pdf]

[https://people.idsia.ch/~steunebrink/Publications/KI09_OCC_revisited.pdf]

[https://www.uv.mx/rmipe/files/2017/12/handbook_of_cognition_and_emotion.pdf]

[https://bulbapedia.bulbagarden.net/wiki/Stat]

[https://stackoverflow.com/questions/6542169/execute-php-scripts-within-node-js-web-server]

[https://saberhortifruti.com.br/frutas-legumes-e-verduras]

[https://color.adobe.com/pt/create/color-wheel]

[https://www.piskelapp.com/p/create/sprite]

[https://www.npmjs.com/package/cgijs]

[https://www.skypack.dev/view/cgijs]

[https://www.autodraw.com/]

[https://pagespeed.web.dev/]

[https://br.pinterest.com/pin/805159239621369051/]

[https://br.pinterest.com/pin/854980310498634254/]

[https://opengameart.org/forumtopic/pixel-art-tutorials-by-sadfacerl]

[https://br.pinterest.com/pin/546483736034220527/]

[https://br.pinterest.com/pin/554646510366402171/]

[https://lospec.com/pixel-art-tutorials/tags/animation]

[https://imgur.com/gallery/VN8e8t7]

[https://imgur.com/user/SadfaceRL]

[https://github.com/Joncom/impact-font-sugar/blob/master/font-sugar.js]

[https://impactjs.com/forums/code/persistence-save-load-level-state/page/1]

[https://github.com/jmo84/persistence-impact]

[https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js]
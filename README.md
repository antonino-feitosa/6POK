# 6POK

6POK é um RogueLike baseado nos jogos da franquia Pokemon.
Ele possui as principais características, porém, quase todas são aleatorizadas de modo que o usuário necessita aprender e desenvolver novas estratégias a cada novo jogo.

## Principais Características

Ele se diferencia dos jogos da franquia Pokemon nos seguintes critérios:
- Utiliza uma ambiente no qual o usuário se movimenta numa malha hexagonal;
- Os Pokemons são substituídos por animais reais;
- Modifica o sistema de batalha para tempo ativo;
- As batalhas ocorrem em mundo aberto;
- Nos movimentos disponíveis;
- Os movimentos consideram a distância e deslocamento do personagem;
- Na quantidade de animais ativos podendo formar uma tropa;
- O ambiente é gerado aleatoriamente assim como:
  - Os animais disponíveis;
  - As condições de evolução;
  - Os itens disponíveis e seus efeitos;
  - Os tipos de movimentos que cada animal pode aprender;
  - A efetividade dos tipos;
  - A quantidade de efeito dos movimento;
  - entre outros fatores.
Em comum, temos o sistema de batalha, tipos, atributos, itens e evolução.

## Interface do Jogo

O jogo é apresentado por uma malha hexagonal de dimensões fixas.
As malhas contêm portais para outras regiões que levam a outras malhas representando áreas selvagens.
As áreas selvagens contêm esconderijos de onde podem surgir animais assim como eles podem fugir e se esconder.
O usuário pode controlar um ou mais animais na malha de modo que cada animal ocupa uma posição distinta.
Cada animal atua num sistema de turnos baseado em tempo ativo, isto é, o tempo de um turno depende dos atributos do animal de modo que animais mais rápidos podem atuar mais vezes por turno que um animal mais lento.
Não é possível capturar outros animais, mas é possível convidá-lo para integrar o bando.
A aceitação do convite é aleatória, no entanto, certos eventos podem aumentar ou diminuir as chances de sucesso.

## Mecânicas do Jogo

### Animais

Cada animal possui um conjunto de valores numéricos denominados de estatísticas que afetam o comportamento do animal. São divididos em seis valores principais:
- Pontos de vida (PV): determina a quantidade de dano que o animal pode receber antes de desmaiar;
- Ataque físico (AF): influencia o quanto de dano um animal causa usando um movimento físico;
- Defesa física (DF): influencia o quanto de dano um animal recebe ao ser acertado por um movimento físico;
- Ataque especial (AE): influencia o quanto de dano um animal causa usando um movimento especial;
- Defesa especial (DE): influencia o quanto de dano um animal recebe ao ser acertado por um movimento especial;
- velocidade (VL): determina a ordem de ação do animal.

As estatísticas de um animal dependem dos valores base (BV), dos valores individuais (IV), dos valores de esforço (EV), pela sua natureza e pelo seu nível.
- Valores base: o valor da estatística em função da espécie do animal. Um valor aleatório escolhido uniformente entre [0,255]. Esses valores são fixos para animais de uma mesma espécie.
- Valores individuais: o valor da estatística em função do animal, isto é, dois animais da mesma espécie podem ter valores diferentes. Um valor aleatório escolhido uniformente entre [0,31].
- Valores de esforço: o valor da estatística em função da experiência de combate do animal. Um animal pode obter um máximo de 510 pontos, com um máximo de 252 por estatística.
- O nível do animal (NV): representa o crescimento ou idade do animal. Valor entre 1 e 100.
- A natureza: determina a predisposição do animal em relação às estatísticas, isto é, uma estatística e favorecida enquanto outra é prejudicada.

Os valores das estatísticas são determinados pela fórmula abaixo:

```math
BaseValue = floor([ (2 * BV + IV + floor(EV/4) ) * NV] / 100)
PV = BaseValue + NV + 10
OTHERS = floor( (BaseValue + 5) * NATURE)
```
Em que PV corresponde à estatística dos pontos de vida e OTHERS corresponde às demais estatísticas sendo que NATURE é o modificador da estatística, caso ele seja aplicável, caso contrário é 1.

#### Natureza

A natureza de um animal influencia o desenvolvimento de suas características com exceção dos pontos de vida.
Logo, temos um total de 25 naturezas e cada uma aumenta uma estatística em 10% e diminui outra em 10%.

<table>
    <thead>
        <tr><th colspan="7">Tabela de Natureza</th></tr>
    </thead>
    <tbody>
        <tr><td></td><td></td><td colspan="5" style="text-align: center;">Aumento da Estatística</td></tr>
        <tr><td></td><td>x</td><td>AF</td><td>DF</td><td>AE</td><td>DE</td><td>VL</td></tr>
        <tr><td rowspan="6" style="writing-mode: vertical-lr;">Diminuição da Estatística</td><td>AF</td><td>Resistente</td><td>Solitário</td><td>Determinado</td><td>Desobidiente</td><td>Corajoso</td></tr>
        <tr><td>DF</td><td>Ousado</td><td>Dócil</td><td>Travesso</td><td>Descontraído</td><td>Relaxado</td></tr>
        <tr><td>AE</td><td>Modesto</td><td>Manso</td><td>Acanhado</td><td>Impetuoso</td><td>Quieto</td></tr>
        <tr><td>DE</td><td>Calmo</td><td>Gentil</td><td>Atento</td><td>Excêntrico</td><td>Atrevido</td></tr>
        <tr><td>VL</td><td>Tímido</td><td>Precipitado</td><td>Contente</td><td>Ingênuo</td><td>Sério</td></tr>
    </tbody>
</table>

 
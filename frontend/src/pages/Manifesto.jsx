import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Manifesto.module.css';

const Manifesto = () => {
  return (
    <div className={styles.container}>
      <div className={styles.tituloPrincipal}>
        <h1>Manifesto dos Trabalhadores da Brasilseg em Luta</h1>
        <p className={styles.subtitulo}>
          Pela organização independente dos trabalhadores e trabalhadoras do telemarketing de seguros de Franca
        </p>
      </div>

      <p className={styles.destinatario}>
        A todos os trabalhadores e trabalhadoras da Central de Relacionamento e Negócios da Brasilseg em Franca.
      </p>

      {/* Imagem de destaque */}
      <div className={styles.imagemDestaque}>
        <img
          src="/hero.png"
          alt="Monitor quebrado com post-it sobre planos de revolução"
          className={styles.imagemManifesto}
        />
      </div>

      {/* Preâmbulo */}
      <section className={styles.bloco}>
        <div className={styles.caixaTitulo}>
          <h2>Preâmbulo</h2>
        </div>
        <div className={styles.caixaCorpo}>
          <p>
            Mais de mil trabalhadores e trabalhadoras sustentam, todos os dias, com o próprio corpo
            e a própria saúde mental, os lucros bilionários da Brasilseg. Vendem seguro de automóvel,
            seguro residencial, seguro de vida, atendem, renovam, resolvem e adoecem. Em anos anteriores,
            a empresa faturou cerca de R$ 17,5 bilhões em prêmios e lucrou R$ 4,4 bilhões. Nesse mesmo
            período, quem produziu essa riqueza seguiu sendo cobrado por metas inumanas selecionadas
            pelo sistema da empresa, segue sendo treinado às pressas a fim de substituir outro funcionário
            que outrora fora descartado, avaliado e monitorado por uma CX que pune mais do que ensina,
            e por fim descartado assim que adoece.
          </p>
          <p>
            Dizemos com todas as letras: essa sucessão de infelicidades não evidencia uma falha de
            gestão pontual. É um método. É projeto de maximização dos lucros por meio da intensificação
            da exploração dos trabalhadores e trabalhadoras que exercem a função de securitários, mas não
            são registrados como tais; trabalhadores e trabalhadoras que sofrem com metas cada vez mais
            elevadas, pressão permanente, sobrecarga de trabalho, adoecimento e precarização das condições
            de trabalho fazem parte da lógica que garante resultados para a empresa. E esse projeto só
            pode ser enfrentado com organização e luta dos trabalhadores.
          </p>
          <p>
            Estes problemas geram uma necessidade de luta, e a necessidade dá à luz a Trabalhadores
            da Brasilseg em Luta.
          </p>
        </div>
      </section>

      {/* Quem somos */}
      <section className={styles.bloco}>
        <div className={styles.caixaTitulo}>
          <h2>Quem somos e o que afirmamos</h2>
        </div>
        <div className={styles.caixaCorpo}>
          <p>
            Somos trabalhadores e trabalhadoras da operação de telemarketing de seguros em Franca,
            atendentes, operadores, supervisores, unidos pela experiência comum da exploração e pela
            plena convicção de que essa realidade só muda pela ação organizada de quem a vive todos os
            dias. Temos o objetivo de denunciar as condições abusivas vivenciadas diariamente pelos
            trabalhadores da Brasilseg.
          </p>
          <p><strong>Por que lutamos:</strong></p>
          <ul>
            <li>Lutamos porque a Brasilseg lucra bilhões enquanto empurra para os trabalhadores o custo da irregularidade desta operação.</li>
            <li>Lutamos porque o adoecimento mental em massa é o preço cobrado por um modelo de gestão que trata gente como recurso descartável.</li>
            <li>Lutamos porque a discriminação de raça, gênero, sexualidade e deficiência, concentrada na base da hierarquia, não é coincidência: é parte da estrutura que organiza e reproduz essas desigualdades.</li>
            <li>Lutamos porque os direitos não caem do céu, nem serão concedidos por boa vontade da diretoria. Direitos são conquistados pela organização coletiva.</li>
          </ul>
          <p>
            Não falamos em nome da empresa, nem esperamos que ela se reforme por mera generosidade.
            Falamos e agimos em nome de quem trabalha.
          </p>
          <p>
            Reconhecemos os sindicatos como as principais ferramentas de organização e luta da classe
            trabalhadora. Infelizmente, os trabalhadores e trabalhadoras da Brasilseg não estão
            representados pelo sindicato de sua categoria, e o sindicato que hoje os representa não
            cumpre sua tarefa fundamental de organizar os trabalhadores e lutar por melhores condições
            de trabalho. É por isso que a Trabalhadores da Brasilseg em Luta nasce para fortalecer a
            organização pela base, sem substituir o sindicato.
          </p>
        </div>
      </section>

      {/* O que denunciamos */}
      <section className={styles.bloco}>
        <div className={styles.caixaTitulo}>
          <h2>O que denunciamos</h2>
        </div>
        <div className={styles.caixaCorpo}>
          <ul>
            <li><strong>Metas abusivas.</strong> Somos cobrados por resultados que dependem de fatores fora do nosso controle, como a demanda de clientes oferecida pelo sistema e a decisão de fechar contrato enquanto a bonificação prometida raramente se concretiza.</li>
            <li><strong>Remuneração aquém da função.</strong> Acumulamos atribuições ao longo do tempo sem qualquer aumento salarial correspondente.</li>
            <li><strong>Treinamento cada vez mais precário.</strong> O que já foi um preparo de 45 dias virou, para muitos, apenas 15, escancara a falta de preocupação com o preparo do trabalhador que muitas vezes está destinado ao descarte prematuro ou posterior ao adoecimento, numa operação cada vez mais exigente.</li>
            <li><strong>Pausas que não descansam, horas extras que não compensam.</strong> Intervalos de minutos consumidos por deslocamento no prédio e fila; banco de horas que não protege; horas extras tratadas como aposta, não como direito.</li>
            <li><strong>Monitoramento punitivo.</strong> Transformado em instrumento de vigilância e pontuação, não de formação.</li>
            <li><strong>Adoecimento mental como rotina.</strong> Afastamentos psiquiátricos recorrentes, seguidos do medo real de ser demitido por ter adoecido e se ausentado da empresa.</li>
            <li><strong>Rotatividade como ferramenta de gestão.</strong> Descarte de quem adoeceu ou reclamou, pressão por pedidos de desligamento, judicialização já incorporada como custo previsto no orçamento da empresa.</li>
            <li><strong>Desigualdades internas.</strong> Racismo, machismo, LGBTfobia que se concentram na base e somem conforme se sobe na hierarquia.</li>
            <li><strong>Desvio de função.</strong> Este é o principal problema que estrutura as demais formas de exploração denunciadas. Embora contratados como operadores de call center, exercemos, na prática, atividades típicas de securitários, como venda de seguros, renovação de apólices, endossos, assessoria e atendimento pós-venda. Ainda assim, permanecemos enquadrados como trabalhadores do telemarketing, sem o reconhecimento da função efetivamente desempenhada, sem o enquadramento sindical correspondente e sem os direitos, salários e benefícios próprios da categoria dos securitários. Esse desvio de função permite à empresa reduzir custos com mão de obra ao mesmo tempo em que exige atribuições cada vez mais complexas. Superar esse enquadramento inadequado significa atacar a raiz de boa parte dos problemas denunciados: garante o reconhecimento da atividade realmente exercida, fortalece a negociação coletiva da categoria e cria condições para enfrentar a defasagem salarial, a ampliação de atribuições sem contrapartida e outras formas de precarização do trabalho.</li>
          </ul>
          <p>
            Isoladamente, cada um desses pontos já seria grave. Juntos, formam um método de
            funcionamento na qual o sistema se mantém, esse método só pode ser enfrentado organizadamente.
          </p>
        </div>
      </section>

      {/* Nossos princípios */}
      <section className={styles.bloco}>
        <div className={styles.caixaTitulo}>
          <h2>Nossos princípios</h2>
        </div>
        <div className={styles.caixaCorpo}>
          <ol>
            <li><strong>Independência de classe.</strong> Não aceitamos tutela da empresa, nem terceirizamos a defesa dos nossos interesses a quem lucra com a nossa exploração.</li>
            <li><strong>Solidariedade.</strong> Nenhum companheiro ou companheira enfrenta sozinho o assédio, o adoecimento ou a ameaça de demissão.</li>
            <li><strong>Combate às desigualdades.</strong> Discriminação não é "caso isolado" resolvido com remanejamento de setor: é estrutura que exige enfrentamento e punição efetiva.</li>
          </ol>
        </div>
      </section>

      {/* O que reivindicamos */}
      <section className={styles.bloco}>
        <div className={styles.caixaTitulo}>
          <h2>O que reivindicamos</h2>
        </div>
        <div className={styles.caixaCorpo}>
          <ul>
            <li>O registro como securitário e todas as condições de trabalho que são previstas para os securitários, juntamente ao enquadramento correto ao Sindicato dos Securitários do Estado de São Paulo;</li>
            <li>Comissões percentuais reais sobre as vendas, no lugar da bonificação incerta;</li>
            <li>Metas realistas e transparentes, que considerem fatores externos ao controle do trabalhador;</li>
            <li>Pausas efetivas, com tempo real para descanso e alimentação;</li>
            <li>Treinamento adequado antes de qualquer cobrança de produtividade;</li>
            <li>Fim do monitoramento da CX como instrumento punitivo;</li>
            <li>Estabilidade no emprego após afastamento por saúde mental;</li>
            <li>Combate efetivo ao assédio, ao racismo e a toda forma de discriminação, com apuração séria e punição real;</li>
            <li>Fim da rotatividade como estratégia de corte de custos.</li>
          </ul>
        </div>
      </section>

      {/* Como lutaremos */}
      <section className={styles.bloco}>
        <div className={styles.caixaTitulo}>
          <h2>Como lutaremos</h2>
        </div>
        <div className={styles.caixaCorpo}>
          <p>
            Nossa principal ferramenta de organização são as denúncias. Toda denúncia revela as
            condições reais de trabalho: metas abusivas, desvio de função, assédio, sobrecarga,
            adoecimento e outros abusos que a empresa insiste em tratar como algo normal.
          </p>
          <p>
            Cada relato ajuda a demonstrar que esses problemas não são casos isolados. Quando os
            trabalhadores compartilham suas experiências, fica evidente que a exploração é coletiva.
            É assim que transformamos a indignação individual em consciência coletiva, organização
            e força para a luta.
          </p>
          <p>
            As denúncias também produzem provas, dão visibilidade aos abusos e criam base para
            reivindicações, mobilizações e outras formas de organização dos trabalhadores.
          </p>
          <p>
            Você pode contribuir enviando sua denúncia. Todo relato, documento ou informação que ajude
            a expor essa realidade fortalece nossa organização e nos aproxima da conquista de nossos
            direitos e do enfrentamento desse esquema de exploração. A identidade de quem denunciar
            será preservada.
          </p>
          <p>
            Sabemos que esses direitos não serão concedidos espontaneamente. Eles serão conquistados
            quando os trabalhadores se organizarem, denunciarem os abusos e lutarem coletivamente.
            Nosso único vínculo é entre os trabalhadores; não mantemos vínculos nem com a empresa, nem
            com nenhum sindicato, e reivindicamos direitos e a garantia do cumprimento dos mesmos.
          </p>
        </div>
      </section>

      {/* Chamado */}
      <section className={styles.bloco}>
        <div className={styles.caixaTitulo}>
          <h2>Chamado — O que pedimos de você agora</h2>
        </div>
        <div className={styles.caixaCorpo}>
          <p>
            Se você trabalha na operação da Brasilseg em Franca e reconhece a sua rotina nestas
            linhas, saiba: o que você sente não é fraqueza individual, nem exagero, nem "coisa da sua
            cabeça". É a consequência esperada de um modelo de exploração. E, exatamente por isso,
            só existe uma resposta que funciona: organização coletiva.
          </p>
          <p><strong>Três atitudes concretas, a partir de hoje:</strong></p>
          <ol>
            <li><strong>Compartilhe seu relato;</strong> é anônimo, e cada denúncia fortalece o quadro que estamos construindo.</li>
            <li><strong>Converse</strong> com pelo menos um colega de setor sobre este manifesto, a organização começa na conversa que parecia pequena demais para importar.</li>
            <li><strong>Procure a Trabalhadores da Brasilseg em Luta</strong> e participe dos nossos grupos, decisões que valem para todos precisam ser tomadas por todos.</li>
          </ol>
          <p className={styles.chamadaFinal}>
            <strong>Por melhores condições de trabalho na Brasilseg!</strong>
          </p>
        </div>
      </section>

      {/* Botões finais */}
      <div className={styles.buttons}>
        <Link to="/formulario" className={styles.btnPrimary}>
          Enviar minha denúncia
        </Link>
        <Link to="/" className={styles.btnSecondary}>
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
};

export default Manifesto;
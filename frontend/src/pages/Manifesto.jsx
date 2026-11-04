import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Manifesto.module.css';

const Manifesto = () => {
  return (
    <div className={styles.container}>
      
      <div className={styles.heroSection}>
        <h1 className={styles.mainTitle}>NOTA POLÍTICA</h1>
        <h2 className={styles.subTitle}>EM DEFESA DO RIO CANOAS E CONTRA SUA PRIVATIZAÇÃO!</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.caixaCreme}>
          <p>O Rio Canoas é o principal manancial de abastecimento de Franca, responsável por aproximadamente 65% da água consumida pela população e pelo abastecimento de cerca de 150 mil moradores, segundo a SABESP. O rio constitui uma das principais fontes de segurança hídrica do município e se estende, além de São Paulo, por Franca, Cristais Paulista e Pedregulho, até Minas Gerais, em Ibiraci e Claraval.</p>
        </div>

        <div className={styles.caixaVerde}>
          <p>Ainda que seja reconhecido pela própria legislação municipal desde 1992 como uma área de interesse especial para a proteção dos mananciais hídricos, o Rio Canoas e, consequentemente, a biodiversidade e a água do povo francano estão sendo ameaçados pelo Projeto de Lei Complementar nº 11/2026, que visa a privatização da Macrozona do Rio Canoas, sendo proposto pelo prefeito Alexandre Ferreira (MDB), que governa a cidade pela terceira vez (2013 a 2016, 2021 a 2024 e 2025 a 2028).</p>
        </div>

        <div className={styles.caixaAzul}>
          <p>Em seu discurso, o projeto estabelece diretrizes para a proteção e ocupação da Macrozona do Rio Canoas, apresentando mecanismos de zoneamento ambiental, recuperação de áreas degradadas e proteção de áreas de preservação. Na prática, porém, estabelece a abertura para uma série de novas atividades econômicas dentro de uma área ambientalmente vulnerável.</p>
        </div>

        <div className={styles.highlightBox}>
          <p>A proposta cria zonas destinadas ao lazer, turismo, cultura e desenvolvimento econômico, nas quais passam a ser admitidos empreendimentos como eco-resorts, eco-hotéis, hotéis-fazenda, pousadas, restaurantes, espaços para eventos, centros de convenções, parques temáticos, atividades esportivas, universidades, clínicas e outros empreendimentos. Também são previstas atividades comerciais, centros de distribuição, agroindústrias, pequenas manufaturas, parques tecnológicos, laboratórios, centros de inovação, entre outros. Logo, uma área estratégica para o abastecimento de água da população está sendo submetida a um grande balcão de novos negócios para a burguesia francana e da região.</p>
        </div>

        <div className={styles.caixaCreme}>
          <p>Enquanto grandes proprietários e empreendedores podem obter lucro com a valorização dessas terras, os custos da degradação ambiental são socializados entre a classe trabalhadora, uma vez que a expansão da ocupação gera graves preocupações ambientais. A bacia possui elevado risco de erosão e assoreamento; a impermeabilização do solo reduz a infiltração da água, altera o escoamento superficial e pode comprometer a vazão e a qualidade dos cursos d’água, ameaçando a segurança hídrica da região e a qualidade da água consumida.</p>
        </div>

        <div className={styles.caixaVerde}>
          <p>Nos últimos meses, audiências públicas foram realizadas para discutir o desenvolvimento da região e já demonstraram o caráter de classe da proposta de lei complementar, contando com a participação de proprietários rurais, empresas de consultoria ambiental e setores interessados diretamente na aprovação do projeto.</p>
          <p>Ainda que houvesse a presença de representantes dos interesses dos trabalhadores nessas audiências, a defesa do Rio Canoas não deve terminar em uma audiência pública. É necessário organizar trabalhadores, estudantes, moradores, movimentos ambientais e todos aqueles que dependem da preservação do manancial para construir uma mobilização permanente em defesa do Rio Canoas.</p>
        </div>

        <div className={styles.callToAction}>
          <p>Não podemos aceitar que decisões que afetarão o abastecimento de Franca pelas próximas décadas sejam tomadas exclusivamente por aqueles que possuem interesses econômicos sobre o território. Diante de campos políticos vacilantes e de representações políticas que hesitam em pronunciar-se a favor do povo francano trabalhador, submetendo-se diretamente aos interesses privados e ao lucro, o único setor capaz de assumir de forma consequente essa tarefa é a classe trabalhadora de forma organizada. Precisamos nos organizar para acompanhar as discussões, participar das audiências, denunciar irregularidades e construir a defesa do Rio Canoas como parte da luta pela vida e pelos direitos da classe trabalhadora.</p>
        </div>

        <div className={styles.caixaAzul}>
          <p>O Rio Canoas não pode ser tratado como uma nova fronteira para a acumulação privada. A discussão sobre sua ocupação expressa uma contradição fundamental: aquilo que é indispensável à reprodução da vida de toda a população — a água e o meio ambiente — encontra-se submetido às relações de propriedade e à busca pelo lucro. A expansão de loteamentos, hotéis, resorts e demais empreendimentos valorizam propriedades privadas e criam novas oportunidades de acumulação.</p>
          <p>A luta contra a ocupação predatória do Rio Canoas deve, portanto, ser compreendida como parte da luta contra a transformação da terra, da água e da natureza em mercadorias, contra a espoliação e especulação imobiliária. As lutas concretas contra a exploração mercantil de determinadas atividades constituem parte de uma luta mais ampla pela reorganização da sociedade e da construção do socialismo.</p>
        </div>

        <div className={styles.finalCall}>
          <p>Defender o Canoas é defender as condições materiais de vida da classe trabalhadora. E essa defesa não será garantida apenas pela boa vontade dos proprietários e legisladores, ela depende da organização daqueles que têm o direito e serão diretamente afetados pelas decisões tomadas sobre o território: a classe trabalhadora de Franca e da região.</p>
        </div>

        <h2 className={styles.slogan}>EM DEFESA DO RIO CANOAS!<br/>CONTRA A PRIVATIZAÇÃO!<br/>PELA ORGANIZAÇÃO DA CLASSE TRABALHADORA!</h2>

        <div className={styles.buttons}>
          <Link to="/formulario" className={styles.btnPrimary}>
            Enviar denúncia / relato
          </Link>
          <Link to="/" className={styles.btnSecondary}>
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Manifesto;
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import Link from 'next/link'
import DateComp from '../components/date'

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function fiftyFifty() {
  return Math.random() > 0.5 ? true : false;
}

function rollNewSet() {
  let id = +new Date();
  const criterias = ["isCircled", "isLeaf", "isFilled"];
  const t = ["isCircled", "isLeaf", "isFilled"]
    , e = Math.floor(3 * Math.random())
    , n = criterias[e]
    , r = 1 === Math.floor(2 * Math.random());
  t.splice(e, 1);
  const i = Math.floor(2 * Math.random())
    , o = t[i]
    , s = 1 === Math.floor(2 * Math.random());
  t.splice(i, 1);
  const a = t[0]
    , u = 1 === Math.floor(2 * Math.random());
  let c = [{
    isCircled: void 0,
    isLeaf: void 0,
    isFilled: void 0,
    rightAnswer: void 0,
    id: id++
  }, {
    isCircled: void 0,
    isLeaf: void 0,
    isFilled: void 0,
    rightAnswer: void 0,
    id: id++
  }, {
    isCircled: void 0,
    isLeaf: void 0,
    isFilled: void 0,
    rightAnswer: void 0,
    id: id++
  }, {
    isCircled: void 0,
    isLeaf: void 0,
    isFilled: void 0,
    rightAnswer: void 0,
    id: id++
  }];
  c[0][n] = r,
    c[0][o] = s,
    c[0][a] = u,
    c[0].rightAnswer = !0,
    c[1][n] = !r,
    c[1][o] = s,
    c[1][a] = !u,
    c[1].rightAnswer = !1,
    c[2][n] = !r,
    c[2][o] = !s,
    c[2][a] = u,
    c[2].rightAnswer = !1,
    c[3][n] = !r,
    c[3][o] = !s,
    c[3][a] = !u,
    c[3].rightAnswer = !1,

    function (t) {
      for (let e = t.length - 1; e > 0; e--) {
        let n = Math.floor(Math.random() * (e + 1));
        [t[e], t[n]] = [t[n], t[e]]
      }
    }(c);

  return c;
}


function generateQuiz() {
  let id = +new Date();
  const parameters = ['isLeaf', 'isCircled', 'isFilled'];
  const options = [];

  shuffle(parameters);

  const uniqueParameter = parameters[0];
  const notUnique1 = parameters[1]
  const notUnique2 = parameters[2];
  const uniqueValue = fiftyFifty();

  for (let i = 0; i < 4; i++) {
    options.push({
      [uniqueParameter]: i === 0 ? uniqueValue : !uniqueValue,
      [notUnique1]: false,
      [notUnique2]: false
    })
  }

  shuffle(options);

  return options;
}

export default function Home({ allPostsData }) {

  const [goodAnswers, setGoodAnswers] = React.useState(0);
  const [highScore, setHighScore] = React.useState(0);
  const [gameOver, setGameOver] = React.useState(true);
  const [startDate, setStartDate] = React.useState(0);
  const [currentDate, setCurrentDate] = React.useState(0);
  const [quizOpts, setQuizOpts] = React.useState([]);

  const remainingSecs = Math.round(60 - (currentDate - startDate) / 1000);

  React.useEffect(() => {
    if (!gameOver) {
      setQuizOpts(rollNewSet());
      setStartDate(+new Date());
      setCurrentDate(+new Date());
      setGoodAnswers(0);
    }
  }, [gameOver])

  React.useEffect(() => {
    setQuizOpts(rollNewSet());
    if (goodAnswers > highScore) {
      setHighScore(goodAnswers);
      localStorage.setItem('highscore', goodAnswers);
    }
  }, [goodAnswers])

  React.useEffect(() => {
    setInterval(() => {
      setCurrentDate(+new Date());
    }, 100);
    const hs = localStorage.getItem('highscore');
    if (hs && !Number.isNaN(+hs)) {
      setHighScore(+hs);
    }
  }, [])

  React.useEffect(() => {
    if (remainingSecs < 0 && !gameOver) {
      setGameOver(true);
    }
  }, [currentDate, startDate]);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>

        {gameOver && <button onClick={() => { setGameOver(false) }}>Start new game!</button>}
        {!gameOver && <>
          <ul>
            <h2>Remaining time: {remainingSecs}</h2>

            {quizOpts.map(x => (
              <img
                style={{ width: 150, height: 150, marginRight: 10, display: 'inline', border: x.isCircled ? '5px solid purple' : 0, borderRadius: 50 }}
                src={`game/${x.isLeaf ? 'leaf' : 'flower'}_${x.isFilled ? 'fill' : 'nofill'}.png`}
                onClick={() => {
                  if (x.rightAnswer) {
                    setGoodAnswers(goodAnswers + 1)
                  }
                  else {
                    setGameOver(true);
                  }
                }}
                key={x.id} />
            ))}
          </ul>
          <div>Good answers: {goodAnswers}</div>
        </>}

        <div>High score: {highScore}</div>
      </section>
    </Layout>
  )
}
import Head from "next/head";
import InsertionSort from "../components/SortingAlgorithm/insertionSort";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Sorting Algorithm Visualization</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="board">
        <h1 className="title">Sorting Algorithm Visualization </h1>
        {/* <p></p> */}
        <InsertionSort />
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .board {
          width: 100%;
          color: #333;
        }
        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
          text-align: center;
        }
              .title,
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

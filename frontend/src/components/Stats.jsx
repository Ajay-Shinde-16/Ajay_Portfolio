import { Fragment } from "react";
import { STATS, MARQUEE } from "../data/content";
import CountUp from "./CountUp";

export function Stats() {
  return (
    <div className="stats">
      <div className="wrap">
        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat" key={s.k}>
              <div className="n">
                <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals} comma={s.comma} />
              </div>
              <div className="k">{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...MARQUEE, ...MARQUEE].map((m, i) => (
          <Fragment key={i}>
            <span><b>{m}</b></span>
            <span className="sep">/</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

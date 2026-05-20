export function detectCondition(query) {
  const q = query.toLowerCase();
  if (/garganta|faringite|amigdal/.test(q)) return "garganta";
  if (/febre|temperatura|febril/.test(q)) return "febre";
  if (/dor|cefaleia|migr|enxaqueca|lombalg/.test(q)) return "dor";
  if (/press[aã]o|hipertens/.test(q)) return "pressao";
  if (/gastrite|reflux|azia|[uú]lcera|es[oô]fago/.test(q)) return "gastrite";
  return "default";
}

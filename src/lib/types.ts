export type ParsedPoint = { lat:number; lon:number; ele:number; dist_km:number; t_s?:number };
export type ParsedGpx = {
  name?: string;
  points: ParsedPoint[];
  totalDistance: number;
  totalAscent: number;
  totalDescent: number;
  hasTime: boolean;
}
export type Waypoint = { id?: string; km:number; t_min:number; type:'auto'|'ravito'|'start'|'finish'; label?:string };

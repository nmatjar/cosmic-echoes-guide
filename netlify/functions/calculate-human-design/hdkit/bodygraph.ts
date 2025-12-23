import { sweph } from "sweph-js";

// The main function: creating a new bodygraph
export async function createBodygraph(name:string, date:Date, location:string) {
  // Create a new Bodygraph that we will fill with values from querying the Swiss Ephemeris.
  const bodygraph: any = {
    name: name,
    birthDateAndTime: date.toUTCString(),
		location: location,
    profile: "",
    channels: [],
    type: "",
    authority: "",
		definition: "",
    definedCenters: [],
		activatedGates: [],
    activations: {
      Personality: {},
      Design: {}
    }
  };

  const flag = sweph.SEFLG_SPEED;

  // 1. Personality Calculations
  const julday_ut_p = (await sweph.swe_julday(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), (date.getUTCHours() + (date.getUTCMinutes() / 60)), sweph.SE_GREG_CAL)).julianDayUT;

  const p_sun = (await sweph.swe_calc_ut(julday_ut_p, sweph.SE_SUN, flag)).longitude;
  bodygraph.activations.Personality.Sun = getActivationFromDecimalDegrees(p_sun);
  let p_earth_pos = p_sun + 180;
  if (p_earth_pos >= 360) p_earth_pos -= 360;
  bodygraph.activations.Personality.Earth = getActivationFromDecimalDegrees(p_earth_pos);

  const p_node = (await sweph.swe_calc_ut(julday_ut_p, sweph.SE_TRUE_NODE, flag)).longitude;
  bodygraph.activations.Personality.NorthNode = getActivationFromDecimalDegrees(p_node);
  let p_snode_pos = p_node + 180;
  if (p_snode_pos >= 360) p_snode_pos -= 360;
  bodygraph.activations.Personality.SouthNode = getActivationFromDecimalDegrees(p_snode_pos);

  bodygraph.activations.Personality.Moon = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_p, sweph.SE_MOON, flag)).longitude);
  bodygraph.activations.Personality.Mercury = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_p, sweph.SE_MERCURY, flag)).longitude);
  bodygraph.activations.Personality.Venus = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_p, sweph.SE_VENUS, flag)).longitude);
  bodygraph.activations.Personality.Mars = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_p, sweph.SE_MARS, flag)).longitude);
  bodygraph.activations.Personality.Jupiter = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_p, sweph.SE_JUPITER, flag)).longitude);
  bodygraph.activations.Personality.Saturn = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_p, sweph.SE_SATURN, flag)).longitude);
  bodygraph.activations.Personality.Uranus = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_p, sweph.SE_URANUS, flag)).longitude);
  bodygraph.activations.Personality.Neptune = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_p, sweph.SE_NEPTUNE, flag)).longitude);
  bodygraph.activations.Personality.Pluto = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_p, sweph.SE_PLUTO, flag)).longitude);

  // 2. Design Calculations
  const designDate = new Date(date.getTime() - 88 * 60 * 60 * 1000 * 24 / 365.25 * 88); // Approximate 88 degrees solar arc
  const julday_ut_d = (await sweph.swe_julday(designDate.getUTCFullYear(), designDate.getUTCMonth() + 1, designDate.getUTCDate(), (designDate.getUTCHours() + (designDate.getUTCMinutes() / 60)), sweph.SE_GREG_CAL)).julianDayUT;

  const d_sun = (await sweph.swe_calc_ut(julday_ut_d, sweph.SE_SUN, flag)).longitude;
  bodygraph.activations.Design.Sun = getActivationFromDecimalDegrees(d_sun);
  let d_earth_pos = d_sun + 180;
  if (d_earth_pos >= 360) d_earth_pos -= 360;
  bodygraph.activations.Design.Earth = getActivationFromDecimalDegrees(d_earth_pos);

  const d_node = (await sweph.swe_calc_ut(julday_ut_d, sweph.SE_TRUE_NODE, flag)).longitude;
  bodygraph.activations.Design.NorthNode = getActivationFromDecimalDegrees(d_node);
  let d_snode_pos = d_node + 180;
  if (d_snode_pos >= 360) d_snode_pos -= 360;
  bodygraph.activations.Design.SouthNode = getActivationFromDecimalDegrees(d_snode_pos);

  bodygraph.activations.Design.Moon = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_d, sweph.SE_MOON, flag)).longitude);
  bodygraph.activations.Design.Mercury = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_d, sweph.SE_MERCURY, flag)).longitude);
  bodygraph.activations.Design.Venus = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_d, sweph.SE_VENUS, flag)).longitude);
  bodygraph.activations.Design.Mars = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_d, sweph.SE_MARS, flag)).longitude);
  bodygraph.activations.Design.Jupiter = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_d, sweph.SE_JUPITER, flag)).longitude);
  bodygraph.activations.Design.Saturn = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_d, sweph.SE_SATURN, flag)).longitude);
  bodygraph.activations.Design.Uranus = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_d, sweph.SE_URANUS, flag)).longitude);
  bodygraph.activations.Design.Neptune = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_d, sweph.SE_NEPTUNE, flag)).longitude);
  bodygraph.activations.Design.Pluto = getActivationFromDecimalDegrees((await sweph.swe_calc_ut(julday_ut_d, sweph.SE_PLUTO, flag)).longitude);


  // 3. Post-calculation processing
  bodygraph.profile = bodygraph.activations.Personality.Sun.Line + "/" + bodygraph.activations.Design.Sun.Line;

  const allActivations = [
      ...Object.values(bodygraph.activations.Personality),
      ...Object.values(bodygraph.activations.Design)
  ];

  const allActivatedGates: { [key: number]: boolean } = {};
  allActivations.forEach((act: any) => {
      allActivatedGates[act.Gate] = true;
      if (!bodygraph.activatedGates.includes(act.Gate)) {
          bodygraph.activatedGates.push(act.Gate);
      }
  });

  for (const act of allActivations) {
    const gate = (act as any).Gate;
    if (harmonicGates[gate]) {
        for (const harmonic of harmonicGates[gate]) {
            if (allActivatedGates[harmonic]) {
                const channel = [gate, harmonic].sort((a, b) => a - b).join('-');
                if (!bodygraph.channels.includes(channel)) {
                    bodygraph.channels.push(channel);
                }
            }
        }
    }
  }
  bodygraph.channels.sort();

  bodygraph.channels.forEach((channel: string) => {
      definedCentersByChannel[channel].forEach(center => {
          if (!bodygraph.definedCenters.includes(center)) {
              bodygraph.definedCenters.push(center);
          }
      });
  });
  bodygraph.definedCenters.sort();

  // Determine Type
  if (bodygraph.definedCenters.includes("Sacral")) {
      bodygraph.type = motorToThroat(bodygraph.channels, bodygraph.definedCenters) ? "Manifesting Generator" : "Generator";
  } else {
      if (motorToThroat(bodygraph.channels, bodygraph.definedCenters)) {
          bodygraph.type = "Manifestor";
      } else {
          bodygraph.type = bodygraph.channels.length > 0 ? "Projector" : "Reflector";
      }
  }

  // Determine Authority
  const authorityHierarchy = ["Solar Plexus", "Sacral", "Spleen", "Ego", "G"];
  let authoritySet = false;
  for (const center of authorityHierarchy) {
      if (bodygraph.definedCenters.includes(center)) {
          const authorityMap: { [key: string]: string } = {
              "Solar Plexus": "Emotional",
              "Sacral": "Sacral",
              "Spleen": "Splenic",
              "Ego": "Ego Projected",
              "G": "Self Projected"
          };
          bodygraph.authority = authorityMap[center];
          authoritySet = true;
          break;
      }
  }
  if (!authoritySet) {
      bodygraph.authority = bodygraph.definedCenters.length > 0 ? "Sounding Board" : "Lunar";
  }

  return bodygraph;
}

// ... (pozostałe funkcje pomocnicze i dane statyczne bez zmian)
// Static data
export const circuitryByChannel:any = {
	"1-8": "Individual",
	"2-14": "Individual",
	"3-60": "Individual",
	"4-63": "Collective Logic",
	"5-15": "Collective Logic",
	"6-59": "Tribal",
	"7-31": "Collective Logic",
	"9-52": "Collective Logic",
	"10-20": "Individual",
	"10-34": "Individual",
	"10-57": "Individual",
	"11-56": "Collective Abstract",
	"12-22": "Individual",
	"13-33": "Collective Abstract",
	"16-48": "Collective Logic",
	"17-62": "Collective Logic",
	"18-58": "Collective Logic",
	"19-49": "Tribal",
	"20-34": "Individual",
	"20-57": "Individual",
	"21-45": "Tribal",
	"23-43": "Individual",
	"24-61": "Individual",
	"25-51": "Individual",
	"26-44": "Tribal",
	"27-50": "Tribal",
	"28-38": "Individual",
	"29-46": "Collective Abstract",
	"30-41": "Collective Abstract",
	"32-54": "Tribal",
	"34-57": "Individual",
	"35-36": "Collective Abstract",
	"37-40": "Tribal",
	"39-55": "Individual",
	"42-53": "Collective Abstract",
	"47-64": "Collective Abstract"
}
export const definedCentersByChannel:any = {
	"1-8": ["G", "Throat"],
	"2-14": ["Sacral", "G"],
	"3-60": ["Root", "Sacral"],
	"4-63": ["Head", "Ajna"],
	"5-15": ["Sacral", "G"],
	"6-59": ["Sacral", "Solar Plexus"],
	"7-31": ["G", "Throat"],
	"9-52": ["Root", "Sacral"],
	"10-20": ["G", "Throat"],
	"10-34": ["G", "Sacral"],
	"10-57": ["G", "Spleen"],
	"11-56": ["Ajna", "Throat"],
	"12-22": ["Throat", "Solar Plexus"],
	"13-33": ["G", "Throat"],
	"16-48": ["Spleen", "Throat"],
	"17-62": ["Ajna", "Throat"],
	"18-58": ["Root", "Spleen"],
	"19-49": ["Root", "Solar Plexus"],
	"20-34": ["Throat", "Sacral"],
	"20-57": ["Throat", "Spleen"],
	"21-45": ["Ego", "Throat"],
	"23-43": ["Ajna", "Throat"],
	"24-61": ["Head", "Ajna"],
	"25-51": ["Ego", "Throat"],
	"26-44": ["Spleen", "Ego"],
	"27-50": ["Spleen", "Sacral"],
	"28-38": ["Spleen", "Root"],
	"29-46": ["Sacral", "G"],
	"30-41": ["Root", "Solar Plexus"],
	"32-54": ["Root", "Spleen"],
	"34-57": ["Sacral", "Spleen"],
	"35-36": ["Solar Plexus", "Throat"],
	"37-40": ["Ego", "Solar Plexus"],
	"39-55": ["Root", "Solar Plexus"],
	"42-53": ["Root", "Sacral"],
	"47-64": ["Head", "Ajna"]
}

export const harmonicGates:any = {
	1: [8],
	2: [14],
	3: [60],
	4: [63],
	5: [15],
	6: [59],
	7: [31],
	8: [1],
	9: [52],
	10: [20, 34, 57],
	11: [56],
	12: [22],
	13: [33],
	14: [2],
	15: [5],
	16: [48],
	17: [62],
	18: [58],
	19: [49],
	20: [10, 34, 57],
	21: [45],
	22: [12],
	23: [43],
	24: [61],
	25: [51],
	26: [44],
	27: [50],
	28: [38],
	29: [46],
	30: [41],
	31: [7],
	32: [54],
	33: [13],
	34: [10, 20, 57],
	35: [36],
	36: [35],
	37: [40],
	38: [28],
	39: [55],
	40: [37],
	41: [30],
	42: [53],
	43: [23],
	44: [26],
	45: [21],
	46: [29],
	47: [64],
	48: [16],
	49: [19],
	50: [27],
	51: [25],
	52: [9],
	53: [42],
	54: [32],
	55: [39],
	56: [11],
	57: [10, 20, 34],
	58: [18],
	59: [6],
	60: [3],
	61: [24],
	62: [17],
	63: [4],
	64: [47]
}

export const Gates 		= {
	order: [41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3, 27, 24, 2, 23, 8,
			20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33, 7, 4, 29, 59, 40, 64, 47, 6,
			46, 18, 48, 57, 32, 50, 28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60]
}

// Utility methods
export function decimalDegreesToDMS(decimalDegrees: string) { // e.g. 128.22903474504145
	// Decimal degrees to degrees, minutes, seconds
	var degrees:number = Math.floor(parseInt(decimalDegrees));
	var degreesFloat:number = parseFloat(decimalDegrees);
	var minutes:number = Math.floor((degreesFloat - degrees) * 60);
	var seconds:number = Math.round((degreesFloat - degrees - minutes/60) * 3600);

	return {
		'degrees': degrees,
		'minutes': minutes,
		'seconds': seconds,
		'displayString': degrees + 'º' + minutes + '\'' + seconds + '"'
	};
}

export function getActivationFromDecimalDegrees(decimalDegrees: any) {
	var degreesFloat:number = parseFloat(decimalDegrees);

		  // Human Design gates start at Gate 41 at 02º00'00" Aquarius, so we have to adjust from 00º00'00" Aries.
			// The distance is 58º00'00" exactly.
	degreesFloat += 58;
	if (degreesFloat >= 360) {
		degreesFloat -= 360;
	}

	var percentageThrough:number = degreesFloat / 360;  // e.g. 182.3705 becomes 0.5065
	var exactLine = 384 * percentageThrough;
	var exactColor = 2304 * percentageThrough;
	var exactTone = 13824 * percentageThrough;
	var exactBase = 69120 * percentageThrough; // e.g. 46151

  return {
		Gate: (Gates.order[Math.floor(percentageThrough * 64)]),
		Line: Math.floor((exactLine % 6) + 1),
		Color: Math.floor((exactColor % 6) + 1),
		Tone: Math.floor((exactTone % 6) + 1),
		Base: Math.floor((exactBase % 5) + 1)
	}
}

// Bodygraph-specific methods
export function motorToThroat(channels: Array<string>, definedCenters: Array<string>) {
	if (!definedCenters.some(e => /Throat/.test(e)) || !definedCenters.some(e => /Solar Plexus|Sacral|Root|Ego/.test(e))) {
		return false; // Throat undefined and/or no motor defined
	}

	// Solar Plexus
	if (definedCenters.some(e => /Solar Plexus/.test(e))) {
		if (channels.some(e => /12-22|35-36/.test(e))) {
			return true;
		}
	}

	// Sacral
	if (definedCenters.some(e => /Sacral/.test(e))) {
		if (channels.some(e => /20-34/.test(e))) {
			return true;
		}
		if (channels.some(e => /2-14|5-15|29-46/.test(e))) { // G Center is defined
			if (channels.some(e => /1-8|7-31|10-20|13-33/.test(e))) {
				return true;
			}
		}
		if (channels.some(e => /27-50/.test(e))) { // Spleen is defined
			if (channels.some(e => /16-48|20-57/.test(e))) {
				return true;
			}
			if (channels.some(e => /10-57/.test(e))) { // G Center is defined
				if (channels.some(e => /1-8|7-31|10-20|13-33/.test(e))) {
					return true;
				}
			}
		}
	}

	// Ego
	if (definedCenters.some(e => /Ego/.test(e))) {
		if (channels.some(e => /21-45/.test(e))) {
			return true;
		}
		if (channels.some(e => /25-51/.test(e))) { // G Center is defined
			if (channels.some(e => /1-8|7-31|10-20|13-33/.test(e))) {
				return true;
			}
			if (channels.some(e => /10-57/.test(e))) { // Spleen is defined
				if (channels.some(e => /16-48|20-57/.test(e))) {
					return true;
				}
			}
		}
		if (channels.some(e => /26-44/.test(e))) { // Spleen is defined
			if (channels.some(e => /16-48|20-57/.test(e))) {
				return true;
			}
		}
	}

	// Root
	if (definedCenters.some(e => /Root/.test(e))) {
		if (channels.some(e => /18-58|28-38|32-54/.test(e))) { // Spleen is defined
			if (channels.some(e => /16-48|20-57/.test(e))) {
				return true;
			}
		}
		if (channels.some(e => /10-57/.test(e))) { // G Center is defined
			if (channels.some(e => /1-8|7-31|10-20|13-33/.test(e))) {
				return true;
			}
		}
	}
	return false;
}
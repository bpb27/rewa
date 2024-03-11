import { type Kysely } from 'kysely';
import { tables } from './20240305234522486_tables';

const winners = [
  {
    id: 10777,
    title: 'Oppenheimer',
    recipient: 'Cillian Murphy',
    name: 'ACTOR IN A LEADING ROLE',
  },
  {
    id: 10781,
    title: 'Oppenheimer',
    recipient: 'Robert Downey Jr.',
    name: 'ACTOR IN A SUPPORTING ROLE',
  },
  {
    id: 10788,
    title: 'Poor Things',
    recipient: 'Emma Stone',
    name: 'ACTRESS IN A LEADING ROLE',
  },
  {
    id: 10793,
    title: 'The Holdovers',
    recipient: "Da'vine Joy Randolph",
    name: 'ACTRESS IN A SUPPORTING ROLE',
  },
  {
    id: 10794,
    title: 'The Boy and the Heron',
    recipient: 'Hayao Miyazaki and Toshio Suzuki',
    name: 'ANIMATED FEATURE FILM',
  },
  {
    id: 10802,
    title: 'Oppenheimer',
    recipient: 'Hoyte van Hoytema',
    name: 'CINEMATOGRAPHY',
  },
  {
    id: 10808,
    title: 'Poor Things',
    recipient: 'Holly Waddington',
    name: 'COSTUME DESIGN',
  },
  {
    id: 10811,
    title: 'Oppenheimer',
    recipient: 'Christopher Nolan',
    name: 'DIRECTING',
  },
  {
    id: 10818,
    title: '20 Days in Mariupol',
    recipient: 'Mstyslav Chernov, Michelle Mizner and Raney Aronson-Rath',
    name: 'DOCUMENTARY FEATURE FILM',
  },
  {
    id: 10822,
    title: 'The Last Repair Shop',
    recipient: 'Ben Proudfoot and Kris Bowers',
    name: 'DOCUMENTARY SHORT FILM',
  },
  {
    id: 10827,
    title: 'Oppenheimer',
    recipient: 'Jennifer Lame',
    name: 'FILM EDITING',
  },
  {
    id: 10833,
    title: 'The Zone of Interest',
    recipient: 'United Kingdom',
    name: 'INTERNATIONAL FEATURE FILM',
  },
  {
    id: 10837,
    title: 'Poor Things',
    recipient: 'Nadia Stacey, Mark Coulier and Josh Weston',
    name: 'MAKEUP AND HAIRSTYLING',
  },
  {
    id: 10842,
    title: 'Oppenheimer',
    recipient: 'Ludwig Göransson',
    name: 'MUSIC (Original Score)',
  },
  {
    id: 10848,
    title: 'Barbie',
    recipient: "WHAT WAS I MADE FOR?; Music and Lyric by Billie Eilish and Finneas O'Connell",
    name: 'MUSIC (Original Song)',
  },
  {
    id: 10855,
    title: 'Oppenheimer',
    recipient: 'Emma Thomas, Charles Roven and Christopher Nolan, Producers',
    name: 'BEST PICTURE',
  },
  {
    id: 10863,
    title: 'Poor Things',
    recipient: 'Production Design: James Price and Shona Heath; Set Decoration: Zsuzsa Mihalek',
    name: 'PRODUCTION DESIGN',
  },
  {
    id: 10868,
    title: 'War Is Over!',
    recipient: 'Dave Mullins and Brad Booker',
    name: 'SHORT FILM (Animated)',
  },
  {
    id: 10873,
    title: 'The Wonderful Story of Henry Sugar',
    recipient: 'Wes Anderson and Steven Rales',
    name: 'SHORT FILM (Live Action)',
  },
  {
    id: 10878,
    title: 'The Zone of Interest',
    recipient: 'Tarn Willers and Johnnie Burn',
    name: 'SOUND',
  },
  {
    id: 10880,
    title: 'Godzilla Minus One',
    recipient: 'Takashi Yamazaki, Kiyoko Shibuya, Masaki Takahashi and Tatsuji Nojima',
    name: 'VISUAL EFFECTS',
  },
  {
    id: 10884,
    title: 'American Fiction',
    recipient: 'Written for the screen by Cord Jefferson',
    name: 'WRITING (Adapted Screenplay)',
  },
  {
    id: 10889,
    title: 'Anatomy of a Fall',
    recipient: 'Screenplay - Justine Triet and Arthur Harari',
    name: 'WRITING (Original Screenplay)',
  },
].map(o => o.id);

export async function up(db: Kysely<any>): Promise<void> {
  await db
    .updateTable(tables.enum.oscars_nominations)
    .set({ won: true })
    .where('id', 'in', winners)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db
    .updateTable(tables.enum.oscars_nominations)
    .set({ won: false })
    .where('id', 'in', winners)
    .execute();
}

import stringComp from 'string-comparison';
import { Prisma } from '../../src/prisma';

const prisma = Prisma.getPrisma();

const run = async () => {
  const oscars = await prisma.oscars_nominations.findMany({
    select: {
      id: true,
      movie_id: true,
      recipient: true,
      movie: {
        select: {
          id: true,
          title: true,
          release_date: true,
          crew_on_movies: {
            select: {
              crew: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
      award: {
        oscars_categories: {
          name: {
            in: ['writing', 'writing_adapted'],
          },
        },
      },
    },
  });

  const mapped = oscars
    .map(oscar => {
      return oscar.recipient
        .split(',')
        .map(r => r.trim())
        .filter(r => !['Jr.', 'Sr.'].includes(r))
        .map(recipient => {
          const crewNames = oscar.movie.crew_on_movies.map(jt => jt.crew.name);
          const cos = stringComp.cosine;
          const matched = cos.sortMatch(recipient, crewNames);
          const selection = matched[matched.length - 1];
          if (selection.rating < 0.8) {
            console.log('low confidence on ', {
              crew: selection.member,
              recipient,
              movie: oscar.movie.title,
            });
          }
          const crew = oscar.movie.crew_on_movies
            .map(jt => jt.crew)
            .find(c => c.name === selection.member);
          return {
            crewId: crew?.id,
            oscarId: oscar.id,
            movieName: oscar.movie.title,
            crewName: crew?.name,
            recipient: oscar.recipient,
          };
        });
    })
    .flat();

  const conjunctionProblems = mapped.filter(o => o.recipient.includes(' and '));
  const missProblems = mapped.filter(o => !o.crewId);
  if (conjunctionProblems.length) {
    console.log(JSON.stringify(conjunctionProblems, null, 2));
    throw new Error(
      `normalize these ${conjunctionProblems.length} conjoined names first (use comma separation)`
    );
  }
  if (missProblems.length) {
    console.log(JSON.stringify(missProblems, null, 2));
    throw new Error(`unable to match ${missProblems.length}`);
  }

  const add = async (i: number) => {
    const oscar = mapped[i];
    if (!oscar) return console.log('done', i);
    // await prisma.crew_on_oscars.create({
    //   data: { crew_id: oscar.crewId!, oscar_id: oscar.oscarId },
    // });
    // console.log(`added ${oscar.crewName} (${oscar.recipient}) on ${oscar.movieName}`);
    add(i + 1);
  };

  add(0);
};

run();

import { trpc } from '~/trpc/client';
import { AppEnums } from '~/utils/enums';
import { titleCase } from '~/utils/format';
import { useMovieMode } from '~/utils/use-movie-mode';
import { type SidebarActions } from '~/utils/use-sidebar';
import { Crate } from '../ui/box';
import { Select } from '../ui/select';
import { Sidebar } from '../ui/sidebar';

type MovieFilterSidebar = {
  toggleToken: (tokenType: AppEnums['token'], id: number) => void;
  oscarsCategoriesNom: number[];
  oscarsCategoriesWon: number[];
} & SidebarActions;

export const MovieFilterSidebar = ({
  oscarsCategoriesNom,
  oscarsCategoriesWon,
  toggleToken,
  ...sidebarActions
}: MovieFilterSidebar) => {
  const movieMode = useMovieMode();
  const categories = trpc.getOscarCategories.useQuery();
  const countries = trpc.getCountries.useQuery({ movieMode });
  const languages = trpc.getLanguages.useQuery({ movieMode });
  return (
    <Sidebar {...sidebarActions}>
      <div className="border-4 border-slate-700 p-2 text-left">
        <table>
          <thead>
            <tr>
              <th>Oscar Category</th>
              <th className="w-[50px]">Won</th>
              <th className="w-[50px]">Nom</th>
            </tr>
          </thead>
          <tbody>
            {categories.data
              ?.filter(c => movieMode !== 'rewa' || c.relevance !== 'low')
              .map(category => (
                <tr key={category.id} className="hover:bg-slate-700">
                  <td>{titleCase(category.name)}</td>
                  <td>
                    <input
                      className="ml-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500"
                      type="checkbox"
                      checked={oscarsCategoriesWon.includes(category.id)}
                      onChange={() => toggleToken('oscarsCategoriesWon', category.id)}
                    />
                  </td>
                  <td>
                    <input
                      className="ml-1 h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:border-blue-500 focus:ring-blue-500"
                      type="checkbox"
                      checked={
                        oscarsCategoriesNom.includes(category.id) ||
                        oscarsCategoriesWon.includes(category.id)
                      }
                      onChange={() => toggleToken('oscarsCategoriesNom', category.id)}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Crate column gap={1}>
        <label className="text-left text-sm font-semibold">Spoken languages</label>
        <Select
          onSelect={id => toggleToken('language', Number(id))}
          options={
            languages.data?.map(({ id, name, total }) => ({
              label: `${name} (${total})`,
              value: String(id),
            })) ?? []
          }
          value=""
        />
      </Crate>
      {/* thought this was filming locations, but it seems to be countries that produced the film */}
      {/* <Crate column gap={1}>
        <label className="text-left text-sm font-semibold">Production countries</label>
        <Select
          onSelect={id => toggleToken('country', id)}
          options={
            countries.data?.map(({ id, name, total }) => ({
              label: `${name} (${total})`,
              value: id,
            })) ?? []
          }
          value=""
        />
      </Crate> */}
    </Sidebar>
  );
};

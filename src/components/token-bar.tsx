import { Token } from '~/data/tokens';
import { AppEnums } from '~/utils/enums';
import { Button } from './ui/button';
import { Icon } from './ui/icons';

type TokenBarProps = {
  clearTokens: () => void;
  searchMode: AppEnums['searchMode'];
  toggleSearchMode: () => void;
  removeToken: (tokenType: AppEnums['token'], id: number) => void;
  tokens: Token[];
};

export const TokenBar = ({
  clearTokens,
  searchMode,
  tokens,
  toggleSearchMode,
  removeToken,
}: TokenBarProps) => {
  return (
    <>
      {tokens.length > 0 && (
        <Button onClick={clearTokens} variant="token">
          <Icon.Close className="mr-2" />
          Clear ({tokens.length})
        </Button>
      )}
      {tokens.length > 1 && (
        <Button className="flex" variant="token" onClick={toggleSearchMode}>
          <Icon.Filter className="mr-2" />
          {searchMode === 'and' ? 'And' : 'Or'}
        </Button>
      )}
      {tokens.map(token => (
        <Button
          className="flex gap-1"
          key={`${token.id}-${token.type}`}
          onClick={() => removeToken(token.type, token.id)}
          variant="token"
        >
          {icon(token.type)}
          {token.name}
        </Button>
      ))}
    </>
  );
};

const icon = (tokenType: AppEnums['token']) => {
  switch (tokenType) {
    case 'director':
      return <Icon.Movie />;
    case 'actor':
      return <Icon.Actor />;
    case 'producer':
      return <Icon.Dollar />;
    case 'writer':
      return <Icon.Pen />;
    case 'cinematographer':
      return <Icon.Video />;
    default:
      return null;
  }
};

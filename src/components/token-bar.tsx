import { Button } from './ui/button';
import { Icon } from './ui/icons';
import { useQueryParams } from '~/data/query-params';
import { Token } from '~/data/tokens';

type TokenBarProps = {
  clear: () => void;
  update: ReturnType<typeof useQueryParams>['update'];
  tokens: Token[];
  mode: 'and' | 'or';
};

export const TokenBar = ({ clear, mode, tokens, update }: TokenBarProps) => {
  return (
    <>
      {tokens.length > 0 && (
        <Button onClick={() => clear()} variant="token">
          <Icon.Close className="mr-2" />
          Clear ({tokens.length})
        </Button>
      )}
      {tokens.length > 1 && (
        <Button
          className="flex"
          variant="token"
          onClick={() => update('searchMode', mode === 'and' ? 'or' : 'and')}
        >
          <Icon.Filter className="mr-2" />
          {mode === 'and' ? 'And' : 'Or'}
        </Button>
      )}
      {tokens.map(token => (
        <Button
          key={`${token.id}-${token.type}`}
          onClick={() => update(token.type, token.id)}
          variant="token"
        >
          {token.name}
        </Button>
      ))}
    </>
  );
};

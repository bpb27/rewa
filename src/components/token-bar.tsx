import { Button } from './ui/button';
import { Icon } from './ui/icons';
import { Token } from '~/data/tokens';

type TokenBarProps = {
  clear: () => void;
  mode: 'and' | 'or';
  toggleSearchMode: () => void;
  toggleToken: (token: Token) => void;
  tokens: Token[];
};

export const TokenBar = ({ clear, mode, tokens, toggleSearchMode, toggleToken }: TokenBarProps) => {
  return (
    <>
      {tokens.length > 0 && (
        <Button onClick={() => clear()} variant="token">
          <Icon.Close className="mr-2" />
          Clear ({tokens.length})
        </Button>
      )}
      {tokens.length > 1 && (
        <Button className="flex" variant="token" onClick={toggleSearchMode}>
          <Icon.Filter className="mr-2" />
          {mode === 'and' ? 'And' : 'Or'}
        </Button>
      )}
      {tokens.map(token => (
        <Button
          key={`${token.id}-${token.type}`}
          onClick={() => toggleToken(token)}
          variant="token"
        >
          {token.name}
        </Button>
      ))}
    </>
  );
};

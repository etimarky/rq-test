import React from 'react';
import { act, render, waitFor } from 'src/test-utils';
import { PokemonListPage } from './PokemonListPage';
import { useNavigate } from 'react-router-dom';

jest.mock('src/hooks/useGetPokemons', () => ({
  useGetPokemons: jest.fn().mockReturnValue({ data: [{ id: '1', name: 'Bulbasaur' }] }),
  useGetPokemonDetail: jest.fn().mockReturnValue({ data: [{ id: '1', name: 'Bulbasaur' }] }),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('PokemonListPage', () => {
  beforeEach(() => {
    (window as Window).location = ('http://localhost/');
  })
  test('it renders', () => {
    const { getByText } = render(<PokemonListPage />);
    getByText('Bulbasaur');
  });
  test('typing in the search bar filters the results', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const { getByText, user, queryByText, getByPlaceholderText } = render(<PokemonListPage />);

    await act(async () => {
      await user.click(getByText('Bulbasaur'));
    });

    const searchBar = getByPlaceholderText('Search...')

    await act(async () => {
      await user.type(searchBar, 'pika');
    });

    await waitFor(() => {
      expect(queryByText('Bulbasaur')).not.toBeInTheDocument();
    });
  });
  test('clicking on a pokemon calls navigate', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const { getByText, user } = render(<PokemonListPage />);

    await act(async () => {
      await user.click(getByText('Bulbasaur'));
    });

    expect(mockNavigate).toHaveBeenCalledWith("/pokemon/1");

    await user.click(getByText('Cancel'))
  });
});

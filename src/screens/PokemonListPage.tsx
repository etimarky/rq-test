import React, { useEffect, useState } from 'react';
import { tss } from '../tss';
import { useGetPokemons } from 'src/hooks/useGetPokemons';
import { SearchBar } from 'src/components/SearchBar';
import { ModalComponent } from 'src/components/Modal';
import { useNavigate, useParams } from 'react-router-dom';

export const PokemonListPage = () => {
  const { classes } = useStyles();
  const { data, loading, error } = useGetPokemons();
  const navigate = useNavigate()
  const { id } = useParams()

  const [filteredPokemon, setFilteredPokemon] = useState(data ?? null)

  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedPokemon, setSelectedPokemon] = useState<string>('')

  useEffect(() => {
    if (id) {
      setSelectedPokemon(id);
      setModalOpen(true);
    }
  }, [id])

  useEffect(() => {
    if (!loading && data && filteredPokemon.length === 0) {
      setFilteredPokemon(data);
    }
  }, [data, loading, filteredPokemon.length]);

  if (error) {
    return <div className={classes.error}>Sorry, there seems to be a problem. Try again later.</div>
  }

  if (loading) {
    return <div className={classes.loading}>Loading...</div>
  }

  const onSearch = (value: string) => {
    const filteredValues = data?.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPokemon(filteredValues)
  }


  const unfocusPokemon = () => {
    setModalOpen(!isModalOpen)
    setSelectedPokemon('')
    navigate('/pokemon')
  }



  return (
    <div className={classes.root}>
      <SearchBar onSearch={onSearch} />

      {filteredPokemon && filteredPokemon.length > 0 ? (


        <ul>
          <li className={classes.header}>
            <span className={classes.cell}>Name</span>
            <span className={classes.cell}>ID</span>
            <span className={classes.cell}>Type</span>
          </li>
          {filteredPokemon.map((d) => (
            <>
              <li className={classes.row} key={d.id}>
                <img className={classes.img} src={d.sprite} />
                <span
                  className={classes.cell}
                  // onMouseEnter={() => {
                  //   setModalOpen(true);
                  //   setSelectedPokemon(d.id);
                  // }}
                  // onMouseLeave={() => {
                  //   setModalOpen(false);
                  //   setSelectedPokemon('');
                  // }}
                  onClick={() => {
                    setModalOpen(true)
                    navigate(`/pokemon/${d.id}`)
                    setSelectedPokemon(d.id)
                  }}
                >
                  {d.name}
                </span>
                <span className={classes.cell}> {d.id}</span>
                <span className={classes.cell}> {d.types}</span>

              </li>
            </>
          ))}
        </ul>
      ) : (
        <div>No Pokémon found.</div>
      )
      }
      <ModalComponent isModalOpen={isModalOpen} handleClose={unfocusPokemon} pokemonId={selectedPokemon} />
    </div >
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
  },
  listItem: { cursor: "pointer", padding: "8px", borderBottom: "1px solid #ddd" },
  loading: {
    color: theme.color.text.primary,
  },
  error: {
    color: theme.color.text.primary,
  },
  img: {
    height: '25px',
    width: '25px'
  },
  row: {
    display: 'flex',
    borderBottom: `1px solid ${theme.color.text.primary}`,
    padding: '8px 0',
  },
  hoverText: {
    cursor: 'pointer',
    color: theme.color.text.primary,
    '&:hover': {
      textDecoration: 'underline',
    },
  }, header: {
    display: 'flex',
    fontWeight: 'bold',
    borderBottom: `2px solid ${theme.color.text.primary}`,
    padding: '8px 0',
  }, cell: {
    flex: 1,
    padding: '0 8px',
  },
}));

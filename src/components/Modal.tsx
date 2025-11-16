import React, { ChangeEvent, useEffect, useState } from 'react';
import { tss } from '../tss';
import { Modal } from 'antd';
import { useGetPokemonDetail } from 'src/hooks/useGetPokemons';
import { classnames } from 'tss-react/tools/classnames';

interface ModalProps {
    isModalOpen: boolean
    handleClose: () => void
    pokemonId: string
};
export const ModalComponent = ({ isModalOpen, handleClose, pokemonId }: ModalProps) => {
    const { classes } = useStyles();
    const { data, loading } = useGetPokemonDetail(pokemonId || "")


    return (
        <Modal
            title={loading ? <div>Loading contents...</div> : <div>{data?.name}</div>}
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onCancel={handleClose}
            confirmLoading={loading}
            onOk={handleClose}
        >
            <div className={classes.wrapper}>
                <div className={classes.children}>
                    <p>ID: {data?.id}</p>
                    <p>Height: {data?.height}</p>
                    <p>Weight: {data?.weight}</p>
                    <p>Capture Rate: {data?.captureRate}</p>
                    <p>Type: {data?.types?.[0]}</p>
                </div>

                <img src={data?.sprite} className={classes.image}></img>
            </div>
        </Modal>
    )
};

const useStyles = tss.create(() => ({
    wrapper: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    }, children: {
        flex: 1,
    },
    image: {
        height: '200px',
        width: '200px'
    }
}));

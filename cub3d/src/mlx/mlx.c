/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mlx.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/08/08 03:11:53 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 02:35:01 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

void	init_mlx(t_mlx *mlx, int xs, int ys, char *title)
{
	mlx->xs = xs;
	mlx->ys = ys;
	mlx->ptr = mlx_init();
	mlx->mntr = mlx_new_window(mlx->ptr, xs, ys, title);
	init_img(mlx, &mlx->dsp, xs, ys);
}

void	free_mlx(t_mlx *mlx)
{
	free_img(&mlx->dsp);
	mlx_destroy_window(mlx->ptr, mlx->mntr);
}

void	free_img(t_img *img)
{
	if (img->ptr)
		mlx_destroy_image(img->mlx_ptr, img->ptr);
}

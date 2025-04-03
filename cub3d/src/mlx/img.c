/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   img.c                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/11 21:53:49 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 02:36:21 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

void	init_img(t_mlx *mlx, t_img *img, int xs, int ys)
{
	img->xs = xs;
	img->ys = ys;
	img->ndn = 0;
	img->bpp = 0;
	img->llen = 0;
	img->ptr = mlx_new_image(mlx->ptr, xs, ys);
	img->addr = mlx_get_data_addr(img->ptr, &img->bpp,
			&img->llen, &img->ndn);
	img->mlx_ptr = mlx->ptr;
}

void	empty_img(t_mlx *mlx, t_img *img)
{
	img->xs = 0;
	img->ys = 0;
	img->ndn = 0;
	img->bpp = 0;
	img->llen = 0;
	img->ptr = NULL;
	img->addr = NULL;
	img->mlx_ptr = mlx->ptr;
}

void	pixel_to_img(t_img *img, int x_pos, int y_pos, int color)
{
	char	*dst;

	if (x_pos < (int)img->xs && y_pos < (int)img->ys && x_pos > 0 && y_pos > 0)
	{
		dst = img->addr + ((img->ys - y_pos) * img->llen) \
		+ (x_pos * (img->bpp / 8));
		*(unsigned int *)dst = color;
	}
}

void	fill_img(t_img *img, int start, int end, int color)
{
	int	x;
	int	y;

	y = start - 1;
	while (++y < end)
	{
		x = -1;
		while (++x < (int)img->xs)
			pixel_to_img(img, x, y, color);
	}
}

void	clean_img(t_img *img)
{
	int	x;
	int	y;

	x = -1;
	while (++x < img->xs)
	{
		y = -1;
		while (++y < img->ys)
			pixel_to_img(img, x, y, assemble_trgb(0, 0, 0, 0));
	}
}

/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   lmlx.h                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/09/11 22:48:56 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 03:07:12 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef LMLX_H

# define LMLX_H
# include <stdio.h>
# include <stdint.h>
# include <fcntl.h>
# include "../minilibx/mlx.h"

typedef struct s_img
{
	int		xs;
	int		ys;
	int		bpp;
	int		ndn;
	int		llen;
	char	*addr;
	void	*ptr;
	void	*mlx_ptr;
}			t_img;

typedef struct s_mlx
{
	size_t	xs;
	size_t	ys;
	t_img	dsp;
	void	*ptr;
	void	*mntr;
}			t_mlx;

void	init_mlx(t_mlx *mlx, int xs, int ys, char *title);
void	free_mlx(t_mlx *mlx);
void	free_img(t_img *img);

void	init_img(t_mlx *mlx, t_img *img, int xs, int ys);
void	empty_img(t_mlx *mlx, t_img *img);
void	pixel_to_img(t_img *img, int xpos, int ypos, int color);
void	fill_img(t_img *img, int start, int end, int color);
void	clean_img(t_img *img);

int		assemble_trgb(uint8_t t, uint8_t r, uint8_t g, uint8_t b);
uint8_t	extract_trgb(int trgb, uint8_t component);

#endif

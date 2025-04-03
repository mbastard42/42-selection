/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   cub3d.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/08/08 02:27:52 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 03:35:45 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef CUB3D_H

# define CUB3D_H
# include "math.h"
# include "lmlx.h"
# include "../libft/includes/libft.h"

typedef struct s_wall {
	t_vec			vec;
	struct s_wall	*next;
}					t_wall;

typedef struct s_data {
	char		**f;
	size_t		mx;
	size_t		my;
	size_t		ms;
	t_mlx		mlx;
	t_vec		ply;
	t_wall		*map;
	int			ceil;
	int			floor;
	t_img		wall[4];
}				t_data;

void		check_args(t_data *d, int argc, char **argv);
void		init_file(t_data *d);

void		init_cub3d(t_data *d, int argc, char **argv);
void		init_param(t_data *d);
void		check_map(t_data *d);
void		init_map(t_data *d, size_t x, size_t y);

void		ray_casting(t_data *d);
t_vec		collide(t_data *d, t_vec *ray, t_wall **map);
t_vec		line(t_data *d, t_vec ray, int col);

void		quit(t_data *d, char *error_message, int clean);
u_int8_t	ft_atoui(const char *str);

#endif

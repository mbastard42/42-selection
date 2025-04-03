/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init_cub3d.c                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/07/29 05:08:09 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/25 03:35:29 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../../includes/cub3d.h"

static void	init_walls(t_data *d)
{
	empty_img(&d->mlx, &d->wall[0]);
	empty_img(&d->mlx, &d->wall[1]);
	empty_img(&d->mlx, &d->wall[2]);
	empty_img(&d->mlx, &d->wall[3]);
}

static void	read_file(t_data *d, int file_fd)
{
	char	*line;
	char	*file_str;

	file_str = NULL;
	line = get_next_line(file_fd);
	if (!line)
		quit(d, "can't open file", 0);
	file_str = ft_strjoin(file_str, line, 1, 1);
	while (line)
	{
		line = get_next_line(file_fd);
		file_str = ft_strjoin(file_str, line, 1, 1);
	}
	free(line);
	d->f = ft_split(file_str, '\n');
	free(file_str);
}

static void	init_player(t_data *d)
{
	size_t	x;
	size_t	y;
	t_pt	s;
	t_pt	e;

	y = -1;
	while (d->f[++y])
	{
		x = -1;
		while (d->f[y][++x])
		{
			if (ft_strchr("SWEN", d->f[y][x]))
				s = new_pt(x * d->ms + d->ms / 2, y * d->ms + d->ms / 2);
			if (d->f[y][x] == 'S')
				e = new_pt(s.x, s.y - d->ms);
			else if (d->f[y][x] == 'W')
				e = new_pt(s.x - d->ms, s.y);
			else if (d->f[y][x] == 'E')
				e = new_pt(s.x + d->ms, s.y);
			else if (d->f[y][x] == 'N')
				e = new_pt(s.x, s.y + d->ms);
		}
	}
	d->ply = new_vec(s, e);
}

void	init_cub3d(t_data *d, int argc, char **argv)
{
	if (argc != 2)
		quit(d, "wrong number of arguments", 0);
	if (ft_strlen(argv[1], 0) < 4 || \
		!ft_strnstr(&argv[1][ft_strlen(argv[1], 0) - 4], ".cub", 4))
		quit(d, "file must be .cub", 0);
	init_walls(d);
	init_mlx(&d->mlx, 1080, 720, "cub3d");
	read_file(d, open(argv[argc - 1], O_RDONLY));
	init_param(d);
	check_map(d);
	init_map(d, 0, 5);
	init_player(d);
}

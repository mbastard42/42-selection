/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/05/09 15:55:51 by mbastard          #+#    #+#             */
/*   Updated: 2022/07/06 21:30:47 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/philo.h"

int	main(int argc, char **argv)
{
	t_scene	scene;

	if (check_args(argc, argv))
	{
		init_scene(&scene, argc, argv);
		if (scene.rules[0] > 1)
			launch_scene(&scene);
		else if (scene.rules[4])
		{
			printf("%zu\t1 is thinking\n", timer());
			stop(scene.rules[1]);
			printf("%zu\t1 is died\n", timer());
		}
		destroy_scene(&scene);
	}
	return (0);
}

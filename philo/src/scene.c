/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   scene.c                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/06/25 13:20:55 by mbastard          #+#    #+#             */
/*   Updated: 2022/07/06 21:19:28 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/philo.h"

static void	watch_scene(t_scene *scene, int *old_state);
static int	check_satiety(t_scene *scene);
static void	print_message(int state, size_t id);

void	launch_scene(t_scene *scene)
{
	int	*old_state;

	old_state = (int *)ft_calloc(scene->rules[0], sizeof(int));
	watch_scene(scene, old_state);
	free(old_state);
}

static void	watch_scene(t_scene *scene, int *old_state)
{
	int		play;
	t_place	*view;

	play = 1;
	view = scene->table;
	while (play)
	{
		pthread_mutex_lock(&view->state_mutex);
		if (view->state != old_state[view->id - 1])
		{
			print_message(view->state, view->id);
			old_state[view->id - 1] = view->state;
			if (view->state == 2)
				update_waitlist(scene);
			if (view->state == -1 || check_satiety(scene))
				play = 0;
		}
		pthread_mutex_unlock(&view->state_mutex);
		view = view->next;
		usleep(42);
	}
}

void	update_waitlist(t_scene *scene)
{
	size_t	i;
	size_t	tmp;

	i = -1;
	pthread_mutex_lock(&scene->waitlist_mutex);
	tmp = scene->waitlist[0];
	while (++i < scene->rules[0] - 1)
		scene->waitlist[i] = scene->waitlist[i + 1];
	scene->waitlist[i] = tmp;
	pthread_mutex_unlock(&scene->waitlist_mutex);
}

static int	check_satiety(t_scene *scene)
{
	size_t	i;

	i = -1;
	while (++i < scene->rules[0])
		if (scene->table[i].state != 4)
			return (0);
	return (1);
}

static void	print_message(int state, size_t id)
{
	size_t	time;

	time = timer();
	if (state == -1)
		printf("%zu\t%zu died\n", time, id);
	else if (state == 1)
		printf("%zu\t%zu is thinking\n", time, id);
	else if (state == 2)
	{
		printf("%zu\t%zu has taken a fork\n", time, id);
		printf("%zu\t%zu has taken a fork\n", time, id);
		printf("%zu\t%zu is eating\n", time, id);
	}
	else if (state == 3)
		printf("%zu\t%zu is sleeping\n", time, id);
}

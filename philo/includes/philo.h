/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   philo.h                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/06 20:58:41 by mbastard          #+#    #+#             */
/*   Updated: 2022/07/06 20:25:14 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef PHILO_H

# define PHILO_H
# include <stdio.h>
# include <stdlib.h>
# include <unistd.h>
# include <pthread.h>
# include <sys/time.h>

typedef struct s_place
{
	int				id;
	int				fork;
	int				state;
	size_t			last_meal;
	pthread_t		philo;
	pthread_mutex_t	fork_mutex;
	pthread_mutex_t	state_mutex;
	struct s_place	*next;
}					t_place;

typedef struct s_scene
{
	size_t			*rules;
	size_t			*waitlist;
	t_place			*table;
	pthread_mutex_t	waitlist_mutex;
}					t_scene;

/**
 * @brief	check if arguments are correct
 *
 * @param argc	arguments count
 * @param argv	arguments values
 * @return	1 if arguments are correct
 */
int		check_args(int argc, char **argv);
/**
 * @brief	initialize the scene
 *
 * @param scene	scene structure
 * @param argc	arguments count
 * @param argv	arguments values
 */
void	init_scene(t_scene *scene, int argc, char **argv);
/**
 * @brief	launch the scene
 *
 * @param scene	scene struct
 */
void	launch_scene(t_scene *scene);
/**
 * @brief	update waitlist
 *
 * @param scene	scene struct
 */
void	update_waitlist(t_scene *scene);
/**
 * @brief	philosophers routine
 *
 * @param data	scene struct
 * @return NULL
 */
void	*exist(void *data);
/**
 * @brief	destroy the scene
 *
 * @param scene	scene struct
 */
void	destroy_scene(t_scene *scene);
/**
 * @brief	return time spent since first call in ms
 *
 * @return	time spent since first call
 */
size_t	timer(void);
/**
 * @brief	stop for (wait_time) ms
 *
 * @param wait_time	time to wait in ms
 */
void	stop(size_t wait_time);
/**
 * @brief 	calculates the length of the (c) character-terminated string (str)
 *
 * @param str 	string
 * @param c 	end character
 *
 * @return 	length of the c-terminated string
 */
size_t	ft_sublen(const char *str, char c);
/**
 * @brief 	returns a pointer to the substring starting at (the first occurrence
 *			of the character (c) + (gap)) in the string (str)
 *
 * @param str 	string to search in
 * @param c 	researched character
 * @param gap 	gap between the first occurence of c and the start of the
 * 				substring
 *
 * @return 	pointer to the first occurrence of c + gap
 */
char	*ft_strchr(const char *str, char c, int gap);
/**
 * @brief 	converts the string (str) to an integer
 *
 * @param str 	string to convert
 *
 * @return 	str converted to an integer
 */
int		ft_atoi(const char *str);
/**
 * @brief 	allocate a memory area filled with null bytes for an array of (n)
 *			objects of size (size)
 *
 * @param n 	number of objects
 * @param size 	size of objects
 * @return 		pointer to the memory area allocated
 */
void	*ft_calloc(size_t n, size_t size);

#endif

/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   get_next_line.h                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/01/06 08:51:53 by mbastard          #+#    #+#             */
/*   Updated: 2022/11/23 06:05:57 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#ifndef GET_NEXT_LINE_H

# define GET_NEXT_LINE_H
# include <unistd.h>
# include <stdlib.h>

# define BUFFER_SIZE 42

char	*get_next_line(int fd);

size_t	s_len(const char *s);
size_t	s_lcpy(char *dst, const char *src, size_t dstsize);

char	*s_chr(const char *s, int c, int next);
char	*s_ljoin(char *s1, char *s2, size_t s1_len, size_t s2_len);

#endif
